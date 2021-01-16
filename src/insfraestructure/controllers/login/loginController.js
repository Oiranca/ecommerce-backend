import Users from '../.././../domine/model/users';
import bcrypt from 'bcrypt';
import { services } from '../../../domine/service/loginServices';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });

        if (user) {
            const isCorrectPassword = await bcrypt.compare(password, user.password);
            if (isCorrectPassword) {
                const userLogin = {
                    email: user.email,
                    password: user.password,
                    role: user.role,
                };
                await res.send({
                    status: '200',
                    token: services.loginServices(userLogin),
                });
            } else {
                res.send({ status: 401, message: 'User not found' });
            }
        }
    } catch (err) {
        res.send({ status: 401, message: 'User not found' });
    }
};

export default { login };
