import { Schema, model } from 'mongoose';

const productsModel = new Schema({
    id_Provider: { type: String, required: true },
    productName: { type: String, required: true },
    ean: { type: Number, required: true },
    pvd: { type: Number, required: true },
    category: { type: Number, required: true },
});

export default model('Products', productsModel);
