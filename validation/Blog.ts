import { body } from 'express-validator';

export const blogValidation = [
    body('blogText', 'Enter Blog')
        .isLength({
            min: 0,
            max: 2000
        })
        .withMessage('Not more then 2000 characters'),
]