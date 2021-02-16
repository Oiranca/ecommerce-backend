import Basket from '../../../domine/model/basket';
import bcrypt from 'bcrypt';
import Users from '../../../domine/model/users';
import roles from '../../../domine/model/roles';
import Admins from '../../../domine/model/admins';
import Product from '../../../domine/model/products';

import jwt from 'jsonwebtoken';
import taxes from '../../../domine/model/tax';

const basketCrud = async (req, res) => {
    try {
        const tokenUser = req.headers['token-users'];
        const { email, role } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
        req.session = {
            email,
            role,
        };
        const { ean, quantity } = req.body;
        const productToSell = await Product.findOne({ ean: ean }).select({
            _id: 1,
            pvd: 1,
        });

        switch (role) {
            case roles.admin:
                console.log('entrando como administrador');
                break;
            case roles.employee:
                console.log('entrando como empleado');
                break;
            case roles.client:
                const userCredential = await Users.findOne({
                    email: req.session.email,
                }).select({ _id: 1 });

                const sellActive = await Basket.findOne({
                    id_client: userCredential._id,
                }).select({
                    _id: 1,
                    total: 1,
                    basket_products: 1,
                });

                if (sellActive) {
                    await Basket.findByIdAndUpdate(
                        { _id: sellActive._id },
                        {
                            $set: {
                                basket_products: [
                                    ...sellActive.basket_products,
                                    {
                                        id_product: productToSell._id,
                                        quantity: quantity,
                                        pvp:
                                            productToSell.pvd * taxes.IGIC +
                                            productToSell.pvd,
                                    },
                                ],
                            },
                            total:
                                sellActive.total +
                                (productToSell.pvd * taxes.IGIC + productToSell.pvd) *
                                    quantity,
                        },
                    );
                } else {
                    await Basket.create({
                        id_client: userCredential._id,
                        basket_products: {
                            id_product: productToSell._id,
                            quantity: quantity,
                            pvp: productToSell.pvd * taxes.IGIC + productToSell.pvd,
                        },
                        total:
                            (productToSell.pvd * taxes.IGIC + productToSell.pvd) *
                            quantity,
                    });
                }

                res.send({ status: 'Ok', message: 'PRODUCT INTRODUCED' });

                break;
        }
    } catch (e) {
        res.status(500).send({ status: 'Error', message: 'ERROR FOR BASKET CREATE' });
    }
};

export default { basketCrud };
