import { Schema } from 'mongoose';

const users = new Schema({
    id_role: { type: String, required: true },
    name: { type: String, required: true },
    surnames: { type: String, required: true },
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

export default users;
