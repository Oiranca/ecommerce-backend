import Provider from '../../../domine/model/provider';
import roles from '../../../domine/model/roles';

const providerRegister = async (req, res) => {
    try {
        const { nameProvider, identification, email, phone, address } = req.body;

        await Provider.create({
            nameProvider,
            identification,
            email,
            phone,
            role: roles.provider,
            address,
        }),
            { collection: 'Providers' };
        res.send({ status: 'ok', message: 'Provider created' });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: e });
    }
};

export default {
    providerRegister,
};
