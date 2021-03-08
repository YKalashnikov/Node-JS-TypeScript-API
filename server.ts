import dotenv from 'dotenv'

dotenv.config()

import express from 'express';
import {passport} from './passport/passport'
import { UserCtrl } from './controllers/UserController';
import { registerValidation } from './validation/Register'
import cors from 'cors';

import './core/db'
import { initialize } from 'passport';

const app = express()
app.use(express.json())
app.use(initialize())
app.use(cors())


app.get('/users', UserCtrl.index)
app.get('/auth/me', passport.authenticate('jwt'), UserCtrl.getUser)
app.get('/users/:id', registerValidation, UserCtrl.show)
app.get('/auth/verify', UserCtrl.verify)
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin)
app.post('/auth/signup', registerValidation, UserCtrl.create)


app.listen(process.env.PORT, (): void => {
    console.log(`Running on port ${process.env.PORT}`)
})