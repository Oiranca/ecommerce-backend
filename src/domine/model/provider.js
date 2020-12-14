import { Schema } from 'mongoose';

const userProvider = new Schema({
    id_admin: { type: Array, required: true },
    nameProvider: { type: String, required: true },
    identification: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    address: {
        street: { type: String, required: true },
        number: { type: Number, required: true },
        floor: { type: String, required: false },
        postalCode: { type: Number, required: true },
    },
    emailIsConfirmated: { type: Boolean, required: true, default: false },
});

export default userProvider;
