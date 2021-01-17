import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    try {
        const tokenUser = req.headers['token-users'];

        if (tokenUser) {
            const dataToken = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
            next();
        } else {
            throw {
                code: 403,
                status: 'ACCESS_DENIED',
                message: 'Missing header token',
            };
        }
    } catch (e) {
        res.send({ status: '403', message: e.message });
    }
};

export { checkAuth };
