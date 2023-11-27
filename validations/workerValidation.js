import { body } from 'express-validator';

export const createValidation = [
    body('FirstName', "Ім'я занадто коротке").isLength({ min: 3 }),
    body('LastName', 'Прізвище занадто коротке').isLength({ min: 3 }),
    body('BirthDate', 'Невірний формат дати народження').isISO8601().toDate(),
    body('RFIDKey', 'Невірний формат RFID ключа').isString().isLength({ min: 1 }),
    body('WorkStartTime', 'Невірний формат початку робочого дня').custom(value => /^\d{2}:\d{2}$/.test(value)),
    body('WorkEndTime', 'Невірний формат завершення робочого дня').custom(value => /^\d{2}:\d{2}$/.test(value)),
    body('BreakStartTime', 'Невірний формат початку перерви').custom(value => /^\d{2}:\d{2}$/.test(value)),
    body('BreakEndTime', 'Невірний формат завершення перерви').custom(value => /^\d{2}:\d{2}$/.test(value)),
    body('WorksInWeekend', 'Невірний формат для роботи у вихідні').isBoolean(),
];

export const editValidation = [
    body('FirstName', "Ім'я занадто коротке").optional().isLength({ min: 3 }),
    body('LastName', 'Прізвище занадто коротке').optional().isLength({ min: 3 }),
    body('BirthDate', 'Невірний формат дати народження').optional().isISO8601().toDate(),
    body('RFIDKey', 'Невірний формат RFID ключа').optional().isString().isLength({ min: 1 }),
    body('WorkStartTime', 'Невірний формат початку робочого дня').optional().custom(value => /^\d{2}:\d{2}$/.test(value)),
    body('WorkEndTime', 'Невірний формат завершення робочого дня').optional().custom(value => /^\d{2}:\d{2}$/.test(value)),
    body('BreakStartTime', 'Невірний формат початку перерви').optional().custom(value => /^\d{2}:\d{2}$/.test(value)),
    body('BreakEndTime', 'Невірний формат завершення перерви').optional().custom(value => /^\d{2}:\d{2}$/.test(value)),
    body('WorksInWeekend', 'Невірний формат для роботи у вихідні').optional().isBoolean(),
];

