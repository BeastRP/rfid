import {body} from 'express-validator';

export const registerValidation = [
    body('UserEmail', 'Невірний формат пошти').isEmail(),
    body('UserPassword', 'Пароль занадто короткий').isLength({min: 5}),
    body('UserFirstName', "Ім'я занадто коротке").isLength({min: 3}),
    body('UserLastName', 'Прізвище занадто коротке').isLength({min: 3}),
    body("UserAvatarUrl", "Невірне посилання на аватарку").optional().isURL(),
];

export const loginValidation = [
    body('UserEmail', 'Невірний формат пошти').isEmail(),
    body('UserPassword', 'Пароль занадто короткий').isLength({min: 5}),
];

export const editValidation = [
    body('UserFirstName', "Ім'я занадто коротке").isLength({min: 3}),
    body('UserLastName', 'Прізвище занадто коротке').isLength({min: 3}),
    body("UserAvatarUrl", "Невірне посилання на аватарку").optional().isURL(),
];