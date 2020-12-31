import { Schema, model } from 'mongoose';

// Todo hay que pasar los roles al darse alta dependiendo del endpoint

const usersModel = new Schema({
    name: { type: String, required: true },
    surnames: { type: String, required: true },
    identification: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    role: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        number: { type: Number, required: true },
        floor: { type: String, required: false },
        postalCode: { type: Number, required: true },
    },
    emailIsConfirmed: { type: Boolean, required: true, default: false },
});

export default model('client', usersModel);
