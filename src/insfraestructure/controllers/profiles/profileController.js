import Client from '../../../domine/model/users';
import Employee from '../../../domine/model/employee';
import jwt from 'jsonwebtoken';
import Admins from '../../../domine/model/admins';
import roles from '../../../domine/model/roles';
import bcrypt from 'bcrypt';
import { updateProfile } from './updateProfileController';

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

const usersUpdateProfile = async (req, res) => {
    const tokenUser = req.headers['token-users'];

    if (tokenUser) {
        const { email, role } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
        req.session = {
            email,
            role,
        };

        const dataIntoBody = req.body;
        let findByEmail;
        if (dataIntoBody) {
            switch (req.session.role) {
                case '1':
                    findByEmail = await Admins.findOne({
                        email: req.session.email,
                    }).select({ _id: 1, password: 1, email: 1, phone: 1, address: 1 });
                    break;
                case '2':
                    findByEmail = await Employee.findOne({
                        email: req.session.email,
                    }).select({ _id: 1, password: 1, email: 1, phone: 1, address: 1 });
                    break;
                case '3':
                    findByEmail = await Client.findOne({
                        email: req.session.email,
                    }).select({ _id: 1, password: 1, email: 1, phone: 1, address: 1 });
                    break;
            }

            await findUserInDataBase(
                dataIntoBody,
                findByEmail,
                req.session.role,
                req,
                res,
            );
        }
    } else {
        throw {
            code: 403,
            status: 'ACCESS_DENIED',
            message: ' TOKEN NOT CORRECT',
        };
    }
};

const findUserInDataBase = async (dataIntoBody, findByEmail, role, req, res) => {
    try {
        for (let keys of Object.keys(dataIntoBody)) {
            switch (keys) {
                case 'password':
                    const isSamePassword = await bcrypt.compare(
                        dataIntoBody.password,
                        findByEmail.password,
                    );
                    if (!isSamePassword) {
                        const hash = await bcrypt.hash(dataIntoBody['password'], 15);
                        await updateProfile.passwordUpdate(findByEmail, hash, role);
                    }
                    break;

                case 'email':
                    if (
                        dataIntoBody.email !== findByEmail.email &&
                        dataIntoBody.email !== ''
                    ) {
                        await updateProfile.emailUpdate(dataIntoBody, findByEmail, role);
                    }
                    break;
                case 'phone':
                    if (
                        dataIntoBody.phone !== findByEmail.phone &&
                        dataIntoBody.phone !== ''
                    ) {
                        await updateProfile.phoneUpdate(dataIntoBody, findByEmail, role);
                    }
                    break;
                case 'address':
                    const addressKeys = Object.keys(dataIntoBody['address']);
                    switch (role) {
                        case (role = roles.admin):
                            await updateProfile.addressUpdate(
                                dataIntoBody,
                                findByEmail,
                                addressKeys,
                                Admins,
                            );
                            break;
                        case (role = roles.employee):
                            await updateProfile.addressUpdate(
                                dataIntoBody,
                                findByEmail,
                                addressKeys,
                                Employee,
                            );
                            break;
                        case (role = roles.client):
                            await updateProfile.addressUpdate(
                                dataIntoBody,
                                findByEmail,
                                addressKeys,
                                Client,
                            );
                            break;
                    }

                    break;
            }
        }
        res.send({ status: '200', message: 'Profile update' });
    } catch (e) {
        res.send({ status: '404', message: 'Update not possible' });
    }
};

export default {
    findUsersProfile,
    findEmployeeProfile,
    findAdminProfile,
    usersUpdateProfile,
};
