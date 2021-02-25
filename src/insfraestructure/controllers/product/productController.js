import Store from '../../../domine/model/store';
import Bills from '../../../domine/model/bills';

const findProduct = async (req) => {
    return Store.findOne({ ean: req.body.ean }).select({
        _id: 1,
        stock: 1,
    });
};

const createProduct = async (req, res) => {
    try {
        const { idProvider, productName, ean, pvd, category, stock } = req.body;
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
                id_provider: idProvider,
                product_name: productName,
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

const findProductsToSeller = (bills) => {
    bills.map((billsActive) => console.log(billsActive.products));
};

const findProducts = async (req, res) => {
    try {
        if (req.body.id_employee !== '') {
            try {
                await Bills.find({ id_employee: req.body.id_employee })
                    .select({
                        'products.id_product': 1,
                        'products.quantity': 1,
                        'products.product_name': 1,

                        _id: 0,
                    })
                    .then((bills) => {
                        findProductsToSeller(bills);
                    });
            } catch (e) {
                res.status(500).send({ status: 'Error', message: 'PRODUCT NOT FOUND' });
            }
        }
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
