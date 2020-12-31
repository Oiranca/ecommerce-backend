import { Schema, model } from 'mongoose';

const storeModel = new Schema({
    id_Product: { type: String, required: true },
    id_Provider: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
});

export default model('store', storeModel);
