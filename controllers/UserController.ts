import { generateMD5 } from './../utils/generateHash';
import { UserModel, UserModelDocumentInterface, UserModelInterface } from './../models/UserModel';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import express from 'express';
import mongoose from 'mongoose';
import { sendEmail } from '../utils/sendEmail';

const isValidObjectId = mongoose.Types.ObjectId.isValid;
class UserController {
    async index(_: any, res: express.Response): Promise<void> {
        try {
            const users = await UserModel.find({}).exec()
            res.json({
                status: 'success',
                dataUsers: users
            })
        }
        catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }
    async show(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = req.params.id;

            if (!isValidObjectId(userId)) {
                res.status(400).send()
                return;
            }
            const user = await UserModel.findById(userId).exec()

            if (!user) {
                res.status(400).json({
                    status: 'error'
                })
                return;
            }
            res.json({
                status: 'success',
                user: user
            })
        }
        catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }
    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).json({
                    status: 'error',
                    errors: errors.array()
                })
                return;
            }
            const userData: UserModelInterface = {
                email: req.body.email,
                username: req.body.username,
                fullname: req.body.fullname,
                password: generateMD5(req.body.password + process.env.SECRET_KEY),
                confirmHash: generateMD5(process.env.SECRET_KEY || Math.random().toString())
            }
            const user = await UserModel.create(userData)

            res.status(201).json({
                status: 'success',
                data: user
            })

            sendEmail({
                emailFrom: 'admin@test.com',
                emailTo: userData.email,
                subject: 'Please confirm your registration',
                html: `Please follow this link to verify <a href="http://localhost:${process.env.PORT || 8888}/users/verify?hash=${userData.confirmHash}">click this link</a>`
            }, (err: Error | null) => {
                if (err) {
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
    async verify(req: any, res: express.Response): Promise<void> {
        try {
            const hash = req.query.hash;

            if (!hash) {
                res.status(400).send();
                return;
            }
            const user = await UserModel.findOne({ confirmHash: hash }).exec()
            if (user) {
                user.confirmed = true;
                user.save()

                res.json({
                    status: 'success',
                    data: user
                })
            } else {
                res.status(404).send();
            }

        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error
            })
        }
    }
    
    async afterLogin(req: express.Request, res: express.Response): Promise<void> {
        try {
        const user = req.user? (req.user as UserModelDocumentInterface).toJSON() : undefined

            res.json({
                status: 'success',
                data: {
                    ...user,
                    token: jwt.sign({ data: user }, process.env.SECRET_KEY || 'Password321!', {expiresIn: '30d'})
                }

            })
        } catch (error) {
            res.status(400).send();
        }
    }
    async getUser(req: express.Request, res: express.Response): Promise<void> {
        try {
        const user = req.user? (req.user as UserModelDocumentInterface).toJSON() : undefined
            res.json({
                status: 'success',
                data: user
            })
        } catch (error) {
            res.status(400).send();
        }
    }

}

export const UserCtrl = new UserController()