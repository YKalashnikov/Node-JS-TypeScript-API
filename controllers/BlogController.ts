import { UserModelDocumentInterface, UserModelInterface } from './../models/UserModel';
import { BlogModel, BlogModelDocumentInterface, BlogModelInterface } from './../models/BlogModel';
import { validationResult } from 'express-validator';
import express from 'express';
import mongoose from 'mongoose';

const isValidObjectId = mongoose.Types.ObjectId.isValid;

class BlogController {
    async index(_: any, res: express.Response): Promise<void> {
        try {
            const blogs = await BlogModel.find({}).exec()
            res.json({
                status: 'success',
                blogs: blogs
            })
        }
        catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }
    async show(req: any, res: express.Response): Promise<void> {
        try {
            const userId = req.params.id;

            if (!isValidObjectId(userId)) {
                res.status(400).send()
                return;
            }
            const blog = await BlogModel.findById(userId).exec()

            if (!blog) {
                res.status(400).json({
                    status: 'error'
                })
                return;
            }
            res.json({
                status: 'success',
                user: blog
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
            const user = req.user as UserModelDocumentInterface;

            if (user?._id) {
                const errors = validationResult(req)

                if (!errors.isEmpty()) {
                    res.status(400).json({
                        status: 'error',
                        errors: errors.array()
                    })
                    return;
                }
                const blogData: BlogModelInterface = {
                    blogText: req.body.blogText,
                    /* time: Date.now(), */
                    user: user._id,
                }
                const blog = await BlogModel.create(blogData)

                res.status(201).json({
                    status: 'success',
                    data: blog
                })
            }

        }
        catch (error) {
            res.json({
                status: 'error',
                message: error
            })

        }
    }
    async remove(req: express.Request, res: express.Response): Promise<void> {
        const user = req.user as UserModelInterface

        try {
            if (user) {
                const blogId = req.params.id;

                if (!isValidObjectId(blogId)) {
                    res.status(400).send()
                    return;
                }

                const blog = await BlogModel.findById(blogId)

                if (blog) {
                    if (String(blog.user._id) === String(user._id)) {
                        blog.remove();
                        res.send();
                    } else {
                        res.status(403).send()
                    }
                } else {
                    res.status(404).send()
                }
            }
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            });
        }
    }
}

export const BlogCtrl = new BlogController()