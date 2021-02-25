import { Schema, model } from 'mongoose';

const storeModel = new Schema({
    id_provider: { type: String, required: true },
    product_name: { type: String, required: true },
    ean: { type: Number, required: true },
    pvd: { type: Number, required: true },
    category: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
});

export default model('store', storeModel);
