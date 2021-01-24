import Users from '../.././../domine/model/users';
import Admins from '../.././../domine/model/admins';
import Employee from '../../../domine/model/employee';
import roles from '../../../domine/model/roles';
import bcrypt from 'bcrypt';
import { idCompany } from '../../../domine/middlewares/auth';

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

        res.send({ status: 'Ok', message: 'Client Create' });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: e });
    }
};

const registerEmployee = async (req, res) => {
    try {
        console.log(idCompany());
        const {
            name,
            surnames,
            password,
            identification,
            email,
            phone,
            companyID,
            address,
        } = req.body;

        const hash = await bcrypt.hash(password, 15);

        await Employee.create({
            name,
            surnames,
            password: hash,
            identification,
            email,
            phone,
            companyID,
            address,
        });

        res.send({ status: 'Ok', message: 'Employee Create' });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: e });
    }
};

export default {
    registerUsers,
    registerEmployee,
};
