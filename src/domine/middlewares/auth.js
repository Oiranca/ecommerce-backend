import jwt from 'jsonwebtoken';
import Employee from '../model/employee';
import Admin from '../model/admins';
import roles from '../model/roles';

const middleware = {
    isCorrectHost: (req, res, next) => {
        const validHost = req.hostname;

        if (process.env.HOST === validHost) {
            next();
        } else {
            res.status(404).send({ status: 'NOT FOUND' });
        }
    },
    checkAuth: (req, res, next) => {
        try {
            const tokenUser = req.headers['token-users'];
            if (tokenUser) {
                const { email } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
                req.session = {
                    email,
                };
                next();
            } else {
                throw {
                    code: 403,
                    status: 'ACCESS_DENIED',
                    message: 'Missing header token',
                };
            }
        } catch (e) {
            res.send({ status: '401', message: e.message });
        }
    },
    isAdmin: (req, res, next) => {
        try {
            const tokenUser = req.headers['token-users'];
            if (tokenUser) {
                const { role } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
                req.session = {
                    role,
                };
                if (role === roles.admin) {
                    next();
                } else {
                    throw {
                        code: 403,
                        status: 'ACCESS_DENIED',
                        message: 'NOT CORRECT ROLE',
                    };
                }
            } else {
                throw {
                    code: 403,
                    status: 'ACCESS_DENIED',
                    message: 'NOT CORRECT TOKEN',
                };
            }
        } catch (e) {
            res.send({ status: 403, message: e.message });
        }
    },
    existAsEmployee: async (req, res, next) => {
        try {
            const { email, identification } = req.body;
            if (email) {
                const findEmailExist = await Employee.findOne({ email: email });
                const findIdentificationExist = await Employee.findOne({
                    identification: identification,
                });
                if (!findEmailExist && !findIdentificationExist) {
                    next();
                } else {
                    throw {
                        code: 403,
                        status: 'ACCESS_DENIED',
                        message: 'EXIST INTO DATABASE',
                    };
                }
            } else {
                throw {
                    code: 403,
                    status: 'ACCESS_DENIED',
                    message: 'NOT CORRECT TOKEN',
                };
            }
        } catch (e) {
            res.send({ status: 403, message: e.message });
        }
    },
    existAsAdmin: async (req, res, next) => {
        try {
            const { email, identification } = req.body;
            if (email) {
                const findEmailExist = await Admin.findOne({ email: email });
                const findIdentificationExist = await Admin.findOne({
                    identification: identification,
                });
                if (!findEmailExist && !findIdentificationExist) {
                    next();
                } else {
                    throw {
                        code: 403,
                        status: 'ACCESS_DENIED',
                        message: 'EXIST INTO DATABASE',
                    };
                }
            } else {
                throw {
                    code: 403,
                    status: 'ACCESS_DENIED',
                    message: 'NOT CORRECT TOKEN',
                };
            }
        } catch (e) {
            res.send({ status: 403, message: e.message });
        }
    },
};
export const middlewares = middleware;
