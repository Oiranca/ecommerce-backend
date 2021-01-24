import Users from '../.././../domine/model/users';
import roles from '../../../domine/model/roles';
import bcrypt from 'bcrypt';

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
        }

        res.send({ status: 'Ok', message: 'Admin Create' });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: e });
    }
};

export default {
    registerUsers,
};
