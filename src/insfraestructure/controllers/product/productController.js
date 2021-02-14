import Products from '../../../domine/model/products';
import Store from '../../../domine/model/store';

const findProduct = async (req) => {
    return Products.findOne({ ean: req.body.ean }).select({
        _id: 1,
    });
};

const createProduct = async (req, res) => {
    try {
        const { id_Provider, productName, ean, pvd, quantity } = req.body;
        const existProduct = await findProduct(req);

        if (existProduct) {
            await Store.findOne({
                id_Product: existProduct._id,
            })
                .select({ _id: 1, stock: 1 })
                .then(async (stocks) => {
                    const sumStock = stocks.stock + parseInt(quantity);
                    await Store.findOneAndUpdate(
                        { _id: stocks._id },
                        {
                            stock: sumStock,
                        },
                    );
                });
        } else {
            await Products.create({
                id_Provider,
                productName,
                ean,
                pvd,
            }).then((product) => {
                Store.create({
                    id_Product: product._id,
                    id_Provider: product.id_Provider,
                    stock: quantity,
                });
            });
        }

        res.send({ status: 'ok', message: 'Product created' });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: e });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const { quantity } = req.body;
        const existProduct = await findProduct(req);
        if (existProduct) {
            await Store.findOne({
                id_Product: existProduct._id,
            })
                .select({ _id: 1, stock: 1, id_Product: 1 })
                .then(async (stocks) => {
                    if (stocks.stock > 0 && stocks.stock >= quantity) {
                        const deleteStock = stocks.stock - parseInt(quantity);
                        const stockController = await Store.findOneAndUpdate(
                            { _id: stocks._id },
                            {
                                $set: {
                                    stock: deleteStock,
                                },
                            },
                            { new: true },
                        );
                        res.send({ status: 'ok', message: 'Product deleted' });
                        if (stockController.stock === 0) {
                            await Store.findOneAndDelete({ _id: stocks._id })
                                .select({
                                    id_Product: 1,
                                })
                                .then(async (productToDeleted) => {
                                    await Products.findByIdAndDelete({
                                        _id: productToDeleted.id_Product,
                                    });
                                });
                        }
                    } else {
                        res.status(500).send({
                            status: 'Error',
                            message: 'DELETED NOT POSSIBLE',
                        });
                    }
                });
        }
    } catch (e) {
        res.status(500).send({ status: 'Error', message: 'DELETED NOT POSSIBLE' });
    }
};
export default {
    createProduct,
    deleteProduct,
};
