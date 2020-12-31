import { Schema, model } from 'mongoose';
import roles from './roles';

const clientModel = new Schema({
    id_role: { type: String, required: true },
    name: { type: String, required: true },
    surnames: { type: String, required: true },
    identification: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    role: { type: String, required: true, default: roles.client },
    address: {
        street: { type: String, required: true },
        number: { type: Number, required: true },
        floor: { type: String, required: false },
        postalCode: { type: Number, required: true },
    },
    emailIsConfirmed: { type: Boolean, required: true, default: false },
});

export default model('client', clientModel);
