import dotenv from 'dotenv'
import express from 'express';
import { UserCtrl } from './controllers/UserController';
import { registerValidation } from './validation/Register'
import cors from 'cors';

import './core/db'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/users', UserCtrl.index)
app.post('/users', registerValidation, UserCtrl.create)

const PORT = 5000;

app.listen(PORT, (): void => {
    console.log(`Running on port ${PORT}`)
})