import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    password2: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    confirmed: {
        type: Boolean
    },
    confirmHash: {
        type: String,
        required: true
    }
})

export const UserModel = model('UserModel', UserSchema)