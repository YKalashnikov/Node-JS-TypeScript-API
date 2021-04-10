import { UserModelDocumentInterface, UserModelInterface } from './../models/UserModel';
import { BlogModel, BlogModelDocumentInterface, BlogModelInterface } from './../models/BlogModel';
import { validationResult } from 'express-validator';
import express from 'express';
import mongoose from 'mongoose';


class FileController {
   async upload(req:any, res: Express.Response) {
       //console.log(req)
   }
}

export const FileCtr = new FileController()