import { Schema, model } from 'mongoose';

const adminsModel = new Schema(
    {
        name: { type: String, required: true },
        surnames: { type: String, required: true },
        password: { type: String, required: true },
        identification: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        phone: { type: Number, required: true, unique: true },
        role: { type: String, required: true },
        address: {
            type: {
                street: { type: String, required: true },
                numberStreet: { type: Number, required: true },
                level: { type: String, required: false },
                postalCode: { type: Number, required: true },
            },
        },
        emailIsConfirmed: { type: Boolean, required: true, default: false },
    },
    { collection: 'admins' },
);

export default model('Admin', adminsModel);
