import Client from '../../../domine/model/users';
import Employee from '../../../domine/model/employee';
import jwt from 'jsonwebtoken';
import Admins from '../../../domine/model/admins';
import roles from '../../../domine/model/roles';
import bcrypt from 'bcrypt';

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

const updateUsersProfile = async (req, res) => {
    try {
        const tokenUser = req.headers['token-users'];

        if (tokenUser) {
            const { email } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
            req.session = {
                email,
            };

            const dataIntoBody = req.body;

            // TODO: Primero comprobar lo que cambia con los campos que no estén vacíos, luego si el email
            //  y el telefono existen pues no actualizar nada y si no es así solamente actualizar los campos que cambian
            if (dataIntoBody) {
                let dataToUpdate = {
                    password: '',
                    email: '',
                    phone: '',
                    address: {
                        street: '',
                        numberStreet: '',
                        level: '',
                        postalCode: '',
                    },
                };
                const findByEmail = await Admins.findOne({
                    email: req.session.email,
                }).select({ _id: 1, password: 1, email: 1, phone: 1, address: 1 });
                const idToUpdate = findByEmail['_id'];
                // let dataToUpdate;
                const bodyKeys = Object.keys(dataIntoBody);
                for (let keys of bodyKeys) {
                    switch (keys) {
                        case 'password':
                            const isSamePassword = await bcrypt.compare(
                                dataIntoBody.password,
                                findByEmail.password,
                            );
                            if (!isSamePassword) {
                                dataToUpdate.password = dataIntoBody['password'];
                            }
                            break;
                        case 'email':
                            if (dataIntoBody.email !== findByEmail.email) {
                                const findDataExist = await Client.findOne({
                                    email: dataIntoBody.email,
                                });

                                if (!findDataExist) {
                                    dataToUpdate.email = dataIntoBody['email'];
                                } else {
                                    throw {
                                        code: 409,
                                        status: 'CONFLICT',
                                        message: ' EMAIL EXIST AS OTHER USER',
                                    };
                                }
                            }
                            break;
                        case 'phone':
                            if (dataIntoBody.phone !== findByEmail.phone) {
                                const findDataExist = await Client.findOne({
                                    phone: dataIntoBody.phone,
                                });

                                if (!findDataExist) {
                                    dataToUpdate.phone = dataIntoBody['phone'];
                                } else {
                                    throw {
                                        code: 409,
                                        status: 'CONFLICT',
                                        message: ' PHONE EXIST AS OTHER USER',
                                    };
                                }
                            }
                            break;
                        case 'address':
                            const addressKeys = Object.keys(dataIntoBody['address']);

                            for (let addressItems of addressKeys) {
                                if (
                                    dataIntoBody.address[addressItems] !==
                                    findByEmail.address[addressItems]
                                ) {
                                    switch (addressItems) {
                                        case 'street': {
                                            dataToUpdate.address.street =
                                                dataIntoBody.address[addressItems];

                                            break;
                                        }
                                        case 'numberStreet': {
                                            dataToUpdate.address.numberStreet =
                                                dataIntoBody.address[addressItems];
                                            break;
                                        }
                                        case 'level': {
                                            dataToUpdate.address.level =
                                                dataIntoBody.address[addressItems];
                                            break;
                                        }
                                        case 'postalCode': {
                                            dataToUpdate.address.postalCode =
                                                dataIntoBody.address[addressItems];
                                            break;
                                        }
                                    }
                                }
                            }
                    }
                }
            }

            res.send({ status: '200', message: 'Profile update' });
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
    updateUsersProfile,
};
