import Client from '../.././../domine/model/users';
import Admins from '../.././../domine/model/admins';
import Employee from '../.././../domine/model/employee';
import bcrypt from 'bcrypt';
import { services } from '../../../domine/service/loginServices';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await Client.findOne({ email });

        if (user) {
            const isCorrectPassword = await bcrypt.compare(password, user.password);
            if (isCorrectPassword) {
                const userLogin = {
                    email: user.email,
                    password: user.password,
                    role: user.role,
                };
                res.send({
                    status: '200',
                    token: services.loginServices(userLogin),
                });
            } else {
                res.send({ status: 401, message: 'Password not found' });
            }
        } else if (!user) {
            user = await Employee.findOne({ email });
            const isCorrectPassword = await bcrypt.compare(password, user.password);
            if (isCorrectPassword) {
                const userLogin = {
                    email: user.email,
                    password: user.password,
                    role: user.role,
                };
                res.send({
                    status: '200',
                    token: services.loginServices(userLogin),
                });
            } else {
                res.send({ status: 401, message: 'Password not found' });
            }
        } else {
            res.send({ status: 401, message: 'User not found' });
        }
    } catch (err) {
        res.send({ status: 401, message: 'User not found' });
    }
};
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admins.findOne({ email });

        if (admin) {
            const isCorrectPassword = await bcrypt.compare(password, admin.password);
            if (isCorrectPassword) {
                const userLogin = {
                    email: admin.email,
                    password: admin.password,
                    role: admin.role,
                };
                await res.send({
                    status: '200',
                    token: services.loginServices(userLogin),
                });
            } else {
                res.send({ status: 401, message: 'Admin not found' });
            }
        } else {
            res.send({ status: 401, message: 'User not found' });
        }
    } catch (err) {
        res.send({ status: 401, message: 'User not found' });
    }
};

export default { login, loginAdmin };
