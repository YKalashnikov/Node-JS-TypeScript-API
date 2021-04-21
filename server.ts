import { FileCtr } from './controllers/FileUploadController';
import dotenv from 'dotenv'
import path = require('path');

dotenv.config()

import express from 'express';
import multer from 'multer';
import { passport } from './passport/passport'
import { UserCtrl } from './controllers/UserController';
import { BlogCtrl } from './controllers/BlogController';
import { registerValidation } from './validation/Register'
import { blogValidation } from './validation/Blog'
import cors from 'cors';


import './core/db'
import { initialize } from 'passport';

const app = express()

app.use(express.json())
app.use(initialize())
app.use(cors())


multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname + '/uploads'))
    },
    filename: function (_, file, cb) {
        const ex = file.mimetype.split('/').pop()
        cb(null, 'image' + '-' + new Date().toISOString() + '.' + ex)
    }
})
const storage = multer.memoryStorage()
const upload = multer({ storage })

app.get('/users', UserCtrl.index)
app.get('/users/me', passport.authenticate('jwt', { session: false }), UserCtrl.getUser)
app.get('/users/:id', registerValidation, UserCtrl.show)

app.get('/blog', BlogCtrl.index)
app.get('/blog/:id', BlogCtrl.show)
app.post('/blog', passport.authenticate('jwt'), blogValidation, BlogCtrl.create)
app.patch('/blog/:id', passport.authenticate('jwt'), blogValidation, BlogCtrl.update)
app.delete('/blog/:id', passport.authenticate('jwt'), BlogCtrl.remove)

app.get('/auth/verify', UserCtrl.verify)
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin)
app.post('/auth/signup', registerValidation, UserCtrl.create)
app.post('/upload', upload.single('avatar'), FileCtr.upload)


app.listen(process.env.PORT, (): void => {
    console.log(`Running on port ${process.env.PORT}`)
})