import Basket from '../../../domine/model/basket';
import Bills from '../../../domine/model/bills';
import Admins from '../../../domine/model/admins';
import Employee from '../../../domine/model/employee';
import roles from '../../../domine/model/roles';
import jwt from 'jsonwebtoken';
import taxes from '../../../domine/model/tax';

const productsSold = async (basket, req, res) => {
    const totalProducts = [];

    basket.basket_products.map((items) => {
        totalProducts.push({
            id_product: items.id_product,
            product_name: items.product_name,
            quantity: items.quantity,
            pvp: items.pvp,
        });
    });
    try {
        await Bills.create({
            id_employee: basket.id_employee,
            id_employeeUpdate: basket.id_employee,
            products: totalProducts,
            id_client: basket.id_client,
            bill_number: 1,
            bill_state: true,
            date: Date.now().toString(),
            date_update: Date.now().toString(),
            tax: taxes.IGIC,
            discount: 0,
            total: basket.total,
        });
        res.send({ status: 'Ok', message: 'BILLS OK' });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: 'ERROR FOR CREATE BILLS' });
    }
};

const createBills = async (req, res) => {
    try {
        let userCredential;

        const tokenUser = req.headers['token-users'];

        const { email, role } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
        req.session = {
            email,
            role,
        };

        switch (role) {
            case roles.admin:
                userCredential = await Admins.findOne({
                    email: req.session.email,
                }).select({ _id: 1 });

                break;
            case roles.employee:
                userCredential = await Employee.findOne({
                    email: req.session.email,
                }).select({ _id: 1 });
        }

        const consultsBasket = await Basket.findOne({
            id_employee: userCredential._id,
        });
        await productsSold(consultsBasket, req, res);
    } catch (e) {
        res.status(500).send({ status: 'Error', message: 'ERROR FOR CREATE BILLS' });
    }
};

const searchAllBills = async (req, res) => {
    try {
        await Bills.findOne({}).then((allBills) =>
            res.send({ status: 'OK', data: allBills }),
        );
    } catch (e) {
        res.status(500).send({ status: 'Error', message: 'BILLS NOT FOUND' });
    }
};

export const billsController = { createBills, searchAllBills };
