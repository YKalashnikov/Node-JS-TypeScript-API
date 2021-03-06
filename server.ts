import dotenv from 'dotenv'

dotenv.config()

import express from 'express';
import { UserCtrl } from './controllers/UserController';
import { registerValidation } from './validation/Register'
import cors from 'cors';

import './core/db'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/users', UserCtrl.index)
app.post('/users', registerValidation, UserCtrl.create)
app.get('/users/verify', UserCtrl.verify)


app.listen(process.env.PORT, (): void => {
    console.log(`Running on port ${process.env.PORT}`)
})