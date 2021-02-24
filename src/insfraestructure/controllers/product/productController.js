import Products from '../../../domine/model/products';
import Store from '../../../domine/model/store';
// Todo realizar cambios necesario para que solo exista store

const findProduct = async (req) => {
    return Store.findOne({ ean: req.body.ean }).select({
        _id: 1,
        stock: 1,
    });
};

const createProduct = async (req, res) => {
    try {
        const { id_provider, productName, ean, pvd, category, stock } = req.body;
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
            await Store.create({
                id_provider,
                productName,
                ean,
                pvd,
                category,
                stock,
            });
        }

        res.send({ status: 'ok', message: 'Product created' });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: e });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const { stock } = req.body;
        const existProduct = await findProduct(req);
        // if (existProduct) {
        //     await Store.findOne({
        //         id_Product: existProduct._id,
        //     })
        //         .select({ _id: 1, stock: 1, id_Product: 1 })
        //         .then(async (stocks) => {
        //             if (stocks.stock > 0 && stocks.stock >= stock) {
        //                 const deleteStock = stocks.stock - parseInt(stock);
        //                 await Store.findOneAndUpdate(
        //                     { _id: stocks._id },
        //                     {
        //                         $set: {
        //                             stock: deleteStock,
        //                         },
        //                     },
        //                 );
        //                 res.send({ status: 'ok', message: 'PRODUCT DELETED' });
        //                 // if (stockController.stock === 0) {
        //                 //     await Store.findOneAndDelete({ _id: stocks._id })
        //                 //         .select({
        //                 //             id_Product: 1,
        //                 //         })
        //                 //         .then(async (productToDeleted) => {
        //                 //             await Products.findByIdAndDelete({
        //                 //                 _id: productToDeleted.id_Product,
        //                 //             });
        //                 //         });
        //                 // }
        //             } else {
        //                 res.status(500).send({
        //                     status: 'Error',
        //                     message: 'DELETED NOT POSSIBLE',
        //                 });
        //             }
        //         });
        // }
        if (existProduct.stock >= stock) {
            const deleteStock = existProduct.stock - parseInt(stock);
            await Store.findByIdAndUpdate(
                { _id: existProduct._id },
                {
                    $set: {
                        stock: deleteStock,
                    },
                },
            );
            res.send({ status: 'ok', message: 'PRODUCT DELETED' });
        } else {
            res.status(500).send({
                status: 'Error',
                message: 'DELETED NOT POSSIBLE',
            });
        }
    } catch (e) {
        res.status(500).send({ status: 'Error', message: 'DELETED NOT POSSIBLE' });
    }
};

const findProducts = async (req, res) => {
    try {
        await Store.find(req.body)
            .select({ __v: 0 })
            .then((products) => {
                res.send({
                    status: 'ok',
                    data: products,
                });
            });
    } catch (e) {
        res.status(500).send({ status: 'Error', message: 'PRODUCT NOT FOUND' });
    }
};
export default {
    createProduct,
    deleteProduct,
    findProducts,
};
