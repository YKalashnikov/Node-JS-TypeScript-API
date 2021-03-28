import dotenv from 'dotenv'

dotenv.config()

import express from 'express';
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



app.listen(process.env.PORT, (): void => {
    console.log(`Running on port ${process.env.PORT}`)
})