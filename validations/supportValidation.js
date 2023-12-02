import { body } from 'express-validator';
import validator from 'validator';  // Додайте цей імпорт

export const addTicketValidation = [
    body('Email', 'Невірний формат пошти').isEmail(),
    body('Name', "Ім'я занадто коротке").isLength({ min: 3 }),
    body('PhoneNumber')
        .custom(value => {
            if (!validator.isMobilePhone(value, 'any', { strictMode: false })) {
                throw new Error('Невірний формат номера телефону');
            }
            return true;
        }),
    body("Title", "Заголовок в тікеті має бути більше 3 символів").isLength({ min: 3 }),
    body("Description", "Опишіть своє питання більше ніж на 10 символів").isLength({ min: 10 }),
];
