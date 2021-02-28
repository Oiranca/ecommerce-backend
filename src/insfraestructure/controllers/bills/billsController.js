import Basket from '../../../domine/model/basket';
import Bills from '../../../domine/model/bills';
import Admins from '../../../domine/model/admins';
import Employee from '../../../domine/model/employee';
import Users from '../../../domine/model/users';

import roles from '../../../domine/model/roles';
import taxes from '../../../domine/model/tax';

import jwt from 'jsonwebtoken';

const productsSold = async (basket, req, res) => {
    const totalProducts = [];
    const date = new Date();
    const dateForBills = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    basket.basket_products.map((items) => {
        totalProducts.push({
            id_product: items.id_product,
            product_name: items.product_name,
            quantity: items.quantity,
            pvp: items.pvp,
        });
    });
    try {
        const billsCount = await Bills.findOne({}, {})
            .sort({ bill_number: -1 })
            .select({ _id: 0, bill_number: 1 });
        const dataClient = await Users.findOne({ _id: basket.id_client }).select({
            _id: 0,
            address: 1,
            identification: 1,
        });

        if (!billsCount) {
            await Bills.create({
                id_employee: basket.id_employee,
                id_employeeUpdate: basket.id_employee,
                products: totalProducts,
                id_client: basket.id_client,
                client_address: dataClient.address,
                client_identification: dataClient.identification,
                bill_number: 0,
                bill_state: true,
                date: dateForBills,
                date_update: dateForBills,
                tax: taxes.IGIC,
                discount: 0,
                total: basket.total,
            });
            res.send({ status: 'Ok', message: 'BILLS OK' });
        } else {
            await Bills.create({
                id_employee: basket.id_employee,
                id_employeeUpdate: basket.id_employee,
                products: totalProducts,
                id_client: basket.id_client,
                client_address: dataClient.address,
                client_identification: dataClient.identification,
                bill_number: billsCount.bill_number + 1,
                bill_state: true,
                date: dateForBills,
                date_update: dateForBills,
                tax: taxes.IGIC,
                discount: 0,
                total: basket.total,
            });
            res.send({ status: 'Ok', message: 'BILLS OK' });
        }
    } catch (e) {
        res.status(500).send({ status: 'Error', message: 'ERROR FOR CREATE BILLS' });
    }
};

const credentialUserOrCompany = (req) => {
    const tokenUser = req.headers['token-users'];

    const { email, role } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
    req.session = {
        email,
        role,
    };
    return { role, email };
};

const createBills = async (req, res) => {
    try {
        let userCredential;
        const role = credentialUserOrCompany(req).role;

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
        const role = credentialUserOrCompany(req).role;
        const email = credentialUserOrCompany(req).email;
        switch (role) {
            case roles.client:
                await Users.findOne({
                    email: email,
                })
                    .select({ _id: 1 })
                    .then((searchBillsUser) =>
                        Bills.find({
                            id_client: searchBillsUser._id,
                        }).then((allBills) => res.send({ status: 'OK', data: allBills })),
                    );
                break;
            default:
                await Bills.find({}).then((allBills) =>
                    res.send({ status: 'OK', data: allBills }),
                );
                break;
        }
    } catch (e) {
        res.status(500).send({ status: 'Error', message: 'BILLS NOT FOUND' });
    }
};

// TODO hacer un filtro por dni, fecha e id de la factura, para poder buscar la factura a modificar
//  y luego hacer la modificación sobre el id de la factura
const modifyBills = async (req, res) => {
    try {
        const role = credentialUserOrCompany(req).role;
        const email = credentialUserOrCompany(req).email;
        switch (role) {
            case roles.admin:
                const adminUpdateBills = await Admins.findOne({ email: email }).select({
                    _id: 1,
                });
                const searchBills = await Bills.find(
                    { id_employee: adminUpdateBills._id.toString() },
                    {},
                );
                break;
            case roles.employee:
                const employeeUpdateBills = await Employee.findOne({
                    email: email,
                }).select({
                    _id: 1,
                });
                console.log(employeeUpdateBills);
                break;
        }
    } catch (e) {
        res.send({ status: e, message: 'ROLE IS NOT CORRECT' });
    }
};

export const billsController = { createBills, searchAllBills, modifyBills };
