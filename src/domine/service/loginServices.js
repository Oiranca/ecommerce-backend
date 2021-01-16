import jwt from 'jsonwebtoken';

const loginServices = (user) => {
    const iatDate = new Date();
    const expiredToken = sumDays(iatDate, 14);
    return jwt.sign(
        user,
        process.env.SECRET_TOKEN,
        { expiresIn: expiredToken },
        (err, token) => {
            console.log(token);
        },
    );
};

const sumDays = (date, daysToSum) => {
    const days = new Date();
    days.setDate(date.getDate() + daysToSum);
    return days.getDate();
};

export const services = {
    loginServices,
};
