import {body} from 'express-validator';

export const createValidation = [
    body('RoomName', "Ім'я занадто коротке").isLength({min: 3}),
];

export const editValidation = [
    body('RoomName', "Ім'я занадто коротке").isLength({min: 3}),
];