import {body} from 'express-validator'

export const registerValidation = [
    body('email', 'Please enter valid email').isEmail(),
    body('password', 'Min 5 characters').isLength({min: 5}),
    body('name', 'Please enter valid name').isLength({ min: 3}),
    body('avatarUrl', 'Wrong url').optional().isURL(),
]