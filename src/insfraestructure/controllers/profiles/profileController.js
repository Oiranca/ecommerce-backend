import Users from '../../../domine/model/users';

const findProfile = async (req, res) => {
    try {
        const findByEmail = await Users.findOne({ email: req.body.email });
        res.send({
            status: '200',
            data: {
                name: findByEmail.name,
                surnames: findByEmail.surnames,
                identification: findByEmail.identification,
                email: findByEmail.email,
                phone: findByEmail.phone,
                address: {
                    street: findByEmail.address.street,
                    numberStreet: findByEmail.address.numberStreet,
                    level: findByEmail.address.level,
                    postalCode: findByEmail.address.postalCode,
                },
            },
        });
    } catch (e) {
        res.send({ status: '404', message: 'Profile not found' });
    }
};

export default {
    findProfile,
};
