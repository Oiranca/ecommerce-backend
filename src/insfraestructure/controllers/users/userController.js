import Users from '../.././../domine/model/users';
import roles from '../../../domine/model/roles';
import bcrypt from 'bcrypt';

const registerUsers = async (req, res) => {
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

        const hash = await bcrypt.hash(password, 15);

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

        res.send({ status: 'Ok', message: 'User Create' });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: e });
    }
};

export default {
    registerUsers,
};
