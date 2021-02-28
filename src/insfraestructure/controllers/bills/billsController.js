import Basket from '../../../domine/model/basket';
import Bills from '../../../domine/model/bills';
import Admins from '../../../domine/model/admins';
import Employee from '../../../domine/model/employee';
import Users from '../../../domine/model/users';
import Store from '../../../domine/model/store';

import roles from '../../../domine/model/roles';
import taxes from '../../../domine/model/tax';

import jwt from 'jsonwebtoken';

const date = new Date();
const dateForBills = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
const productsSold = async (basket, req, res) => {
    const totalProducts = [];

    const { client_identification } = req.body;

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
        const dataClient = await Users.findOne({
            identification: client_identification,
        }).select({
            _id: 0,
            address: 1,
        });

        if (!billsCount) {
            await Bills.create({
                id_employee: basket.id_employee,
                id_employeeUpdate: basket.id_employee,
                products: totalProducts,
                id_client: basket.id_client,
                client_address: dataClient.address,
                client_identification: client_identification,
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
                client_identification: client_identification,
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
        res.status(500).send({ status: e, message: 'ERROR FOR CREATE BILLS' });
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

const searchAllBills = async (req, res, idEmployeeModify) => {
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

const modifyBills = async (req, res) => {
    async function toModifyBills(employeeToModifyBills) {
        const searchBills = await Bills.find({
            client_identification: req.body.client_identification,
            date: req.body.date,
        });
        for (let searchBillsNumber of searchBills) {
            if (req.body.bill_number === searchBillsNumber.bill_number) {
                if (req.body.products !== '') {
                    let productModify;
                    let totalIntoBill;
                    const idProductToModify = await Store.findOne({
                        ean: req.body.products.ean,
                    }).select({ _id: 1, pvd: 1 });

                    const productIntoBill = await Bills.findOne({
                        bill_number: req.body.bill_number,
                    }).select({ _id: 0, products: 1, total: 1 });

                    productModify = productIntoBill.products;
                    totalIntoBill = productIntoBill.total;
                    productModify.map((itemsToModify) => {
                        if (
                            itemsToModify.id_product === idProductToModify._id.toString()
                        ) {
                            for (let index in productIntoBill.products) {
                                if (
                                    productIntoBill.products[index].id_product ===
                                    idProductToModify._id.toString()
                                ) {
                                    if (req.body.products.quantity > 0) {
                                        productIntoBill.products[index].quantity +=
                                            req.body.products.quantity;
                                        totalIntoBill +=
                                            productIntoBill.products[index].pvp *
                                            req.body.products.quantity;
                                        return productModify;
                                    } else if (
                                        productIntoBill.products[index].quantity -
                                            Math.abs(req.body.products.quantity) >
                                        0
                                    ) {
                                        productIntoBill.products[index].quantity +=
                                            req.body.products.quantity;
                                        totalIntoBill +=
                                            productIntoBill.products[index].pvp *
                                            req.body.products.quantity;
                                        return productModify;
                                    } else {
                                        totalIntoBill -=
                                            productIntoBill.products[index].pvp *
                                            productIntoBill.products[index].quantity;
                                        productIntoBill.products.splice(index, 1);
                                    }
                                }
                            }
                        }
                    });
                    try {
                        console.log(dateForBills);
                        await Bills.findOneAndUpdate(
                            { bill_number: req.body.bill_number },
                            {
                                $set: {
                                    products: productModify,
                                    total: totalIntoBill,
                                    id_employeeUpdate: employeeToModifyBills._id.toString(),
                                    date_update: dateForBills,
                                },
                            },
                        );
                        res.send({
                            status: '200',
                            message: 'BILLS MODIFY',
                        });
                    } catch (e) {
                        res.send({
                            status: e,
                            message: 'MODIFY BILLS NOT POSSIBLE',
                        });
                    }
                } else {
                    res.send({
                        status: '200',
                        message: 'NOTHING TO MODIFY',
                    });
                }
            }
        }
    }

    try {
        const role = credentialUserOrCompany(req).role;
        const email = credentialUserOrCompany(req).email;
        switch (role) {
            case roles.admin:
                const adminUpdateBills = await Admins.findOne({ email: email }).select({
                    _id: 1,
                });
                await toModifyBills(adminUpdateBills);

                break;
            case roles.employee:
                const employeeUpdateBills = await Employee.findOne({
                    email: email,
                }).select({
                    _id: 1,
                });
                await toModifyBills(employeeUpdateBills);

                break;
        }
    } catch (e) {
        res.send({ status: e, message: 'ROLE IS NOT CORRECT' });
    }
};

export const billsController = { createBills, searchAllBills, modifyBills };
