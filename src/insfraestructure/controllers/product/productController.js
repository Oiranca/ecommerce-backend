import Products from '../../../domine/model/products';

const createProduct = async (req, res) => {
    try {
        const { id_Provider, productName, ean, pvd } = req.body;

        await Products.create({
            id_Provider,
            productName,
            ean,
            pvd,
        });
        res.send({ status: 'ok', message: 'Product created' });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: e });
    }
};

export default {
    createProduct,
};
