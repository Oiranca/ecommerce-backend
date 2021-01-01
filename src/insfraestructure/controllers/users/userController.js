import Users from '../.././../domine/model/users';
import roles from '../../../domine/model/roles';

const registerUsers = async (req, res) => {
    try {
        console.log(req.body);
        const {
            name,
            surnames,
            password,
            identification,
            email,
            phone,
            address,
        } = req.body;

        await Users.create({
            name,
            surnames,
            password,
            identification,
            email,
            phone,
            role: roles.client,
            address,
            // emailIsConfirmed: false,
        });

        res.send({ status: 'Ok', message: 'User Create' });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: e });
    }
};

export default {
    registerUsers,
};
