import Basket from '../../../domine/model/basket';
import Admins from '../../../domine/model/admins';
import Employee from '../../../domine/model/employee';
import Users from '../../../domine/model/users';
import roles from '../../../domine/model/roles';
import Store from '../../../domine/model/store';
import jwt from 'jsonwebtoken';
import taxes from '../../../domine/model/tax';

const insertProductsIntoBasket = async (
    sellActive,
    typeOfID,
    productToSell,
    quantity,
    res,
    userCredential,
) => {
    let idShopOnline = '';
    let basketProduct = '';
    let totalActive = '';
    let quantityActive = '';
    let idProductActive = '';
    let findProductActive = '';
    const findIntoBasketActive = (shopCredential) => {
        findProductActive = shopCredential.basket_products.filter(
            (itemsActive) => itemsActive.id_product === productToSell._id.toString(),
        );
        idShopOnline = shopCredential._id;
        idProductActive = findProductActive.map((idIntoBasket) => idIntoBasket._id);
        basketProduct = shopCredential.basket_products;
        totalActive = shopCredential.total;
        quantityActive = findProductActive.map((itemsIntoBasket) => {
            if (itemsIntoBasket.id_product === productToSell._id.toString()) {
                return Number(itemsIntoBasket.quantity);
            }
        });
        findProductActive.map((itemsToModify) => {
            if (itemsToModify.id_product === productToSell._id.toString()) {
                for (let index in basketProduct) {
                    if (
                        basketProduct[index].id_product === productToSell._id.toString()
                    ) {
                        if (quantity > 0) {
                            basketProduct[index].quantity =
                                Number(quantityActive) + quantity;
                            return basketProduct;
                        } else if (
                            basketProduct[index].quantity - Math.abs(quantity) >
                            0
                        ) {
                            basketProduct[index].quantity =
                                Number(quantityActive) + quantity;
                            return basketProduct;
                        } else {
                            basketProduct.splice(index, 1);
                        }
                    }
                }
            }
        });
        return {
            findProductActive,
            idShopOnline,
            idProductActive,
            basketProduct,
            totalActive,
            quantityActive,
        };
    };
    if (typeOfID === 'ONLINE') {
        for (let shopCredential of sellActive) {
            if (shopCredential.id_employee === 'ONLINE') {
                findIntoBasketActive(shopCredential);
            }
        }
    } else {
        for (let shopCredential of sellActive) {
            if (shopCredential.id_employee === typeOfID._id.toString()) {
                findIntoBasketActive(shopCredential);
            }
        }
    }

    if (idShopOnline) {
        if (idProductActive.toString()) {
            await Basket.findOneAndUpdate(
                {
                    _id: idShopOnline,
                },
                {
                    $set: {
                        basket_products: basketProduct,
                    },
                    total:
                        totalActive +
                        (productToSell.pvd * taxes.IGIC + productToSell.pvd) * quantity,
                },
            );

            res.send({ status: 'Ok', message: 'PRODUCT INTRODUCED' });
        } else {
            if (quantity > 0) {
                await Basket.findByIdAndUpdate(
                    { _id: idShopOnline._id },
                    {
                        $set: {
                            basket_products: [
                                ...basketProduct,
                                {
                                    id_product: productToSell._id,
                                    product_name: productToSell.product_name,
                                    quantity: quantity,
                                    pvp:
                                        productToSell.pvd * taxes.IGIC +
                                        productToSell.pvd,
                                },
                            ],
                        },
                        total:
                            totalActive +
                            (productToSell.pvd * taxes.IGIC + productToSell.pvd) *
                                quantity,
                    },
                );
                res.send({ status: 'Ok', message: 'PRODUCT INTRODUCED' });
            } else {
                res.status(500).send({
                    status: 'Error',
                    message: 'ERROR FOR BASKET CREATE',
                });
            }
        }
    } else {
        if (quantity > 0) {
            await Basket.create({
                id_employee: typeOfID !== 'ONLINE' ? typeOfID._id : typeOfID,
                id_client: userCredential._id,
                basket_products: {
                    id_product: productToSell._id,
                    product_name: productToSell.product_name,
                    quantity: quantity,
                    pvp: productToSell.pvd * taxes.IGIC + productToSell.pvd,
                },
                total: (productToSell.pvd * taxes.IGIC + productToSell.pvd) * quantity,
            });
            res.send({ status: 'Ok', message: 'PRODUCT INTRODUCED' });
        } else {
            res.status(500).send({ status: 'Error', message: 'ERROR FOR BASKET CREATE' });
        }
    }
};

const basketCrud = async (req, res) => {
    const findSellActive = async (userCredential) => {
        return Basket.find({
            id_client: userCredential._id,
        }).select({
            _id: 1,
            id_employee: 1,
            total: 1,
            basket_products: 1,
        });
    };

    try {
        const tokenUser = req.headers['token-users'];
        let userCredential;
        let sellActive;

        const { email, role } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
        req.session = {
            email,
            role,
        };
        const { ean, quantity, clientIdentification } = req.body;
        const productToSell = await Store.findOne({ ean: ean }).select({
            _id: 1,
            pvd: 1,
            product_name: 1,
        });

        switch (role) {
            case roles.admin:
                const adminCredential = await Admins.findOne({
                    email: req.session.email,
                }).select({ _id: 1 });
                userCredential = await Users.findOne({
                    identification: clientIdentification,
                }).select({ _id: 1 });

                sellActive = await findSellActive(userCredential);
                await insertProductsIntoBasket(
                    sellActive,
                    adminCredential,
                    productToSell,
                    quantity,
                    res,
                    userCredential,
                );
                break;
            case roles.employee:
                const employeeCredential = await Employee.findOne({
                    email: req.session.email,
                }).select({ _id: 1 });
                userCredential = await Users.findOne({
                    identification: clientIdentification,
                }).select({ _id: 1 });

                sellActive = await findSellActive(userCredential);
                await insertProductsIntoBasket(
                    sellActive,
                    employeeCredential,
                    productToSell,
                    quantity,
                    res,
                    userCredential,
                );

                break;
            case roles.client:
                const id_default = 'ONLINE';
                userCredential = await Users.findOne({
                    email: req.session.email,
                }).select({ _id: 1 });

                sellActive = await findSellActive(userCredential);
                await insertProductsIntoBasket(
                    sellActive,
                    id_default,
                    productToSell,
                    quantity,
                    res,
                    userCredential,
                );

                break;
        }
    } catch (e) {
        res.status(500).send({ status: 'Error', message: 'ERROR FOR BASKET CREATE' });
    }
};

export default { basketCrud };
