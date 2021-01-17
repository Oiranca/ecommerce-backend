import jwt from 'jsonwebtoken';

const loginServices = (user) => {
    const expiredToken = 24 * 60 * 60 * 15;
    return jwt.sign(user, process.env.SECRET_TOKEN, { expiresIn: expiredToken });
};

export const services = {
    loginServices,
};
