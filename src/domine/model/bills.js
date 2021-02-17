import { Schema, model } from 'mongoose';

const billsModel = new Schema({
    id_employee: { type: String, required: true },
    id_employeeUpdate: { type: String, required: true },
    products: {
        type: [
            {
                id_product: { type: String, required: true },
                quantity: { type: Number, required: true },
                pvp: { type: Number, required: true },
            },
        ],
        required: true,
    },
    id_client: { type: String, required: true },
    bill_number: { type: Number, required: true },
    bill_state: { type: Boolean, required: true, default: true },
    date: { type: String, required: true },
    date_update: { type: String, required: true },
    tax: { type: Number, required: true },
    pvp: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
});

export default model('Bills', billsModel);
