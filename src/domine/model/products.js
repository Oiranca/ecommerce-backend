import { Schema, model } from 'mongoose';

const productsModel = new Schema({
    id_provider: { type: String, required: true },
    productName: { type: String, required: true },
    ean: { type: Number, required: true },
    pvd: { type: Number, required: true },
    category: { type: Number, required: true },
});

export default model('Products', productsModel);
