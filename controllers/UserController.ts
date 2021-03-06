import { generateMD5 } from './../utils/generateHash';
import { UserModel } from './../models/UserModel';
import { validationResult } from 'express-validator';
import express from 'express';


class UserController {
    async index(_: any, res: express.Response): Promise<void> {
        try {
            const users = await UserModel.find({}).exec()
            res.send({
                status: 'success',
                dataUsers: users
            })
        }
        catch (error) {
            res.send({
                status: 'error',
                message: error
            })
        }
    }
    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).send({
                    status: 'error',
                    errors: errors.array()
                })
                return;
            }
            const userData = {
                email: req.body.email,
                fullname: req.body.fullname,
                password: req.body.password,
                confirmHash: generateMD5(process.env.SECRET_KEY || Math.random().toString())
            }
            const user = await UserModel.create(userData)
            res.send({
                status: 'success',
                message: user
            })
            return;
        }
        catch (error) {


        }
    }

}

export const UserCtrl = new UserController()