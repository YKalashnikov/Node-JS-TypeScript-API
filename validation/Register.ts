import {body} from 'express-validator';

export const registerValidation = [
        body('email', 'Enter Email')
        .isEmail()
        .withMessage('Email is Incorrect')
        .isLength({
            min: 10,
            max: 50
        })
        .withMessage('The length of the characters between 10 and 50'),
        body('name', 'Enter Name')
        .isString()
        .isLength({
            min: 2,
            max: 50
        })
        .withMessage('The length of the characters between 2 and 50'),
        body('fullname', 'Enter Fullname')
        .isString()
        .isLength({
            min: 2,
            max: 50
        })
        .withMessage('The length of the characters between 2 and 50'),
        body('password', 'Enter Password')
        .isString()
        .isLength({
            min: 5
        })
        .withMessage('The minimum length of the password is 5 character')
        .custom ((value, { req }) => {
            if(value !== req.body.password2) {
                throw new Error('Password is not matching')
            } else {}
            return value
        })
        
]