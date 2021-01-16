import { model, Schema } from 'mongoose';
import roles from './roles';

const userProvider = new Schema({
    nameProvider: { type: String, required: true },
    role: { type: String, required: true, default: roles.provider },
    identification: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    address: {
        street: { type: String, required: true },
        numberStreet: { type: Number, required: true },
        floor: { type: String, required: false },
        postalCode: { type: Number, required: true },
    },
    emailIsConfirmed: { type: Boolean, required: true, default: false },
});

export default model('UsersProvider', userProvider);
