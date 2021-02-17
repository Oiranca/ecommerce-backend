import Users from '../.././../domine/model/users';
import Admins from '../.././../domine/model/admins';
import Employee from '../../../domine/model/employee';
import roles from '../../../domine/model/roles';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUsers = async (req, res) => {
    try {
        const route = req.route.path;
        const {
            name,
            surnames,
            password,
            identification,
            email,
            phone,
            address,
        } = req.body;

        const hash = await bcrypt.hash(password, 15);

        if (route === '/user/users-register') {
            await Users.create({
                name,
                surnames,
                password: hash,
                identification,
                email,
                phone,
                role: roles.client,
                address,
            });
        } else if (route === '/admin/admin-register') {
            await Admins.create({
                name,
                surnames,
                password: hash,
                identification,
                email,
                phone,
                role: roles.admin,
                address,
            });
        }

        res.send({ status: 'Ok', message: 'User Create' });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: e });
    }
};

const registerEmployee = async (req, res) => {
    try {
        const {
            name,
            surnames,
            password,
            identification,
            email,
            phone,
            address,
        } = req.body;
        let idCompany;
        const tokenUser = req.headers['token-users'];

        if (tokenUser) {
            const { email } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
            req.session = {
                email,
            };
            const adminId = await Admins.findOne({ email: req.session.email });
            idCompany = adminId._id;
        } else {
            throw {
                code: 403,
                status: 'ACCESS_DENIED',
                message: ' ROLE NOT CORRECT',
            };
        }

        const hash = await bcrypt.hash(password, 15);

        await Employee.create({
            name,
            surnames,
            password: hash,
            identification,
            email,
            phone,
            companyID: idCompany,
            role: roles.employee,
            address,
        });

        res.send({ status: 'Ok', message: 'Employee Create' });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: e.message });
    }
};

export default {
    registerUsers,
    registerEmployee,
};
