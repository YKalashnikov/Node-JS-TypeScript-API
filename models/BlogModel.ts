import { model, Schema, Document } from 'mongoose';
import { UserModelDocumentInterface } from './UserModel';

export interface BlogModelInterface {
    _id?: string;
    timestamp?: Date;
    blogText: string;
    user: UserModelDocumentInterface;
}

export type BlogModelDocumentInterface = BlogModelInterface & Document;

const BlogSchema = new Schema({
    blogText: {
        type: String,
        required: true
    },
    timestamp: {
         type: Date, default: new Date().toISOString()
         },
    user: {
        required: true,
        ref: 'User',
        type: Schema.Types.ObjectId,

    }
})


export const BlogModel = model<BlogModelDocumentInterface>('Blog', BlogSchema)