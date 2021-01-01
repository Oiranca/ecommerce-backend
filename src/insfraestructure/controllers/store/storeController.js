import Store from '../../../domine/model/store';

const registerInStore = async (req, res) => {
    try {
        const { id_Product, id_Provider, stock } = req.body;

        await Store.create({
            id_Product,
            id_Provider,
            stock,
        });
        res.send({ status: 'ok', message: 'Product register into store' });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: e });
    }
};

export default {
    registerInStore,
};
