import {body} from 'express-validator';

export const createValidation = [
    body('CompanyName', "Ім'я занадто коротке").isLength({min: 3}),
];
export const editValidation = [
    body('CompanyName', "Ім'я занадто коротке").isLength({min: 3}),
];
export const addUserValidation = [
    body('RoleName', "Ім'я занадто коротке").isLength({min: 3}),
];

