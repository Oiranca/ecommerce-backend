import { Schema, model } from 'mongoose';

const basketModel = new Schema({
    id_client: { type: String, required: true },
    id_employee: { type: String, required: true },
    basket_products: {
        type: [
            {
                id_product: { type: String, required: true },
                product_name: { type: String, required: true },

                quantity: { type: Number, required: true },
                pvp: { type: Number, required: true },
            },
        ],
        required: true,
    },
    total: { type: Number, required: true, default: 0 },
});

export default model('Basket', basketModel);
