import express from 'express';
import cloudinary  from '../core/cloudinary';


class FileController {
    async upload(req: express.Request, res: express.Response) {
        const file = req.file;
        const filePath = '../' + file.path;

        cloudinary.uploader.upload_stream({resource_type: 'auto'}, (error, result)=> {
            if(error || !result) {
                return res.status(500).json({
                    status: 'error',
                    message: error || 'upload server'
                })
            }
            res.status(201).json({
                status: 'success',
                message: 'Successfully Uploaded',
                url: result.url,
                size: Math.round(result.bytes / 1024),
                width: result.width,
                height: result.height
            });
        }).end(file.buffer)  
        
    }
}

export const FileCtr = new FileController()