import Client from '../../../domine/model/users';
import Employee from '../../../domine/model/employee';
import jwt from 'jsonwebtoken';
import Admins from '../../../domine/model/admins';

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
            const { email } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
            req.session = {
                email,
            };
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
};
