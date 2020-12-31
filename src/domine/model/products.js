import { Schema, model } from 'mongoose';

const productsModel = new Schema({
    id_Provider: { type: String, required: true },
    productName: { type: String, required: true },
    EAN: { type: Number, required: true },
    PVD: { type: Number },
});

export default model('products', productsModel);
