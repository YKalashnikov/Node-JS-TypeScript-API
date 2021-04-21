import {v2 as cloudinary} from 'cloudinary';

import dotenv from 'dotenv'

dotenv.config()

if (!process.env.CLOUDINARY_NAME) {
    throw new Error('Cloudinary configuration is missing')
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
})

export default cloudinary;