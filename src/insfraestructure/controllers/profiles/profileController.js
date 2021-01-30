import Client from '../../../domine/model/users';
import Employee from '../../../domine/model/employee';
import jwt from 'jsonwebtoken';
import Admins from '../../../domine/model/admins';
import roles from '../../../domine/model/roles';


const findUsersProfile = async (req, res) => {
    try {
        const tokenUser = req.headers['token-users'];

        if (tokenUser) {
            const { email } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
            req.session = {
                email,
            };
            const findByEmail = await Client.findOne({ email: req.session.email });
            res.send({
                status: '200',
                data: {
                    name: findByEmail.name,
                    surnames: findByEmail.surnames,
                    identification: findByEmail.identification,
                    email: findByEmail.email,
                    phone: findByEmail.phone,
                    address: {
                        street: findByEmail.address.street,
                        numberStreet: findByEmail.address.numberStreet,
                        level: findByEmail.address.level,
                        postalCode: findByEmail.address.postalCode,
                    },
                },
            });
        } else {
            throw {
                code: 403,
                status: 'ACCESS_DENIED',
                message: ' TOKEN NOT CORRECT',
            };
        }
    } catch (e) {
        res.send({ status: '404', message: 'Profile not found' });
    }
};
const findEmployeeProfile = async (req, res) => {
    try {
        const tokenUser = req.headers['token-users'];
        if (tokenUser) {
            const { email, role } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
            req.session = {
                email,
                role,
            };
            if (req.session.role === roles.admin) {
                const findEmployeeAsAdmin = await Employee.findOne({
                    email: req.body.email,
                });
                res.send({
                    status: '200',
                    data: {
                        name: findEmployeeAsAdmin.name,
                        surnames: findEmployeeAsAdmin.surnames,
                        identification: findEmployeeAsAdmin.identification,
                        email: findEmployeeAsAdmin.email,
                        phone: findEmployeeAsAdmin.phone,
                        address: {
                            street: findEmployeeAsAdmin.address.street,
                            numberStreet: findEmployeeAsAdmin.address.numberStreet,
                            level: findEmployeeAsAdmin.address.level,
                            postalCode: findEmployeeAsAdmin.address.postalCode,
                        },
                    },
                });
            } else if (req.session.role === roles.employee) {
                const findByEmail = await Employee.findOne({ email: req.session.email });

                res.send({
                    status: '200',
                    data: {
                        name: findByEmail.name,
                        surnames: findByEmail.surnames,
                        identification: findByEmail.identification,
                        email: findByEmail.email,
                        phone: findByEmail.phone,
                        address: {
                            street: findByEmail.address.street,
                            numberStreet: findByEmail.address.numberStreet,
                            level: findByEmail.address.level,
                            postalCode: findByEmail.address.postalCode,
                        },
                    },
                });
            }

        } else {
            throw {
                code: 403,
                status: 'ACCESS_DENIED',
                message: ' TOKEN NOT CORRECT',
            };
        }
    } catch (e) {
        res.send({ status: '404', message: 'Profile not found' });
    }
};
const findAdminProfile = async (req, res) => {
    try {
        const tokenUser = req.headers['token-users'];

        if (tokenUser) {
            const { email } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
            req.session = {
                email,
            };
            const findByEmail = await Admins.findOne({ email: req.session.email });
            res.send({
                status: '200',
                data: {
                    name: findByEmail.name,
                    surnames: findByEmail.surnames,
                    identification: findByEmail.identification,
                    email: findByEmail.email,
                    phone: findByEmail.phone,
                    address: {
                        street: findByEmail.address.street,
                        numberStreet: findByEmail.address.numberStreet,
                        level: findByEmail.address.level,
                        postalCode: findByEmail.address.postalCode,
                    },
                },
            });
        } else {
            throw {
                code: 403,
                status: 'ACCESS_DENIED',
                message: ' TOKEN NOT CORRECT',
            };
        }
    } catch (e) {
        res.send({ status: '404', message: 'Profile not found' });
    }
};

export default {
    findUsersProfile,
    findEmployeeProfile,
    findAdminProfile,
};
