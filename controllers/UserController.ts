import { generateMD5 } from './../utils/generateHash';
import { UserModel } from './../models/UserModel';
import { validationResult } from 'express-validator';
import express from 'express';
import {sendEmail} from '../utils/sendEmail';


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
                username: req.body.username,
                fullname: req.body.fullname,
                password: req.body.password,
                confirmHash: generateMD5(process.env.SECRET_KEY || Math.random().toString())
            }
            const user = await UserModel.create(userData)

            res.json({
                status: 'success',
                data: user
            })

            sendEmail({
                emailFrom: 'admin@test.com', 
                emailTo: userData.email,
                subject: 'Please confirm your registration',
                html: `Please follow this link to verify <a href="http://localhost:${process.env.PORT || 8888}/users/verify?hash=${userData.confirmHash}">click this link</a>`
            }, (err: Error | null) => {
                if(err) {
                    res.json({
                        status: 'error',
                        message: err,
                    })
                }
            })
        }
        catch (error) {
            res.json({
                status: 'error',
                message: error
            })

        }
    }

}

export const UserCtrl = new UserController()