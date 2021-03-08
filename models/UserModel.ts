import { model, Schema, Document } from 'mongoose';
export interface UserModelInterface {
    _id?: string;
    email: string;
    username: string;
    fullname: string;
    password: string;
    location?: string;
    confirmed?: boolean;
    confirmHash: string;
}

export type UserModelDocumentInterface = UserModelInterface & Document;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    confirmHash: {
        type: String,
        required: true
    }
})

UserSchema.set('toJSON', {
    transform: function (_: any, obj: any) {
        delete obj.password;
        delete obj.confirmHash;
        return obj
    }
})

export const UserModel = model<UserModelDocumentInterface>('UserModel', UserSchema)