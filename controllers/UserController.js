import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        //Шифруємо пароль у змінну passwordHash використовуючи сіль
        const UserPassword = req.body.UserPassword;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(UserPassword, salt);

        //Підготовка шаблону створення документа моделі юзеру (таблиці юзер з бази даних)
        const doc = new UserModel({
            UserEmail: req.body.UserEmail,
            UserFirstName: req.body.UserFirstName,
            UserLastName: req.body.UserLastName,
            UserAvatarUrl: req.body.UserAvatarUrl,
            passwordHash: hash,
        });

        //Створення документа за шаблоном вище
        const user = await doc.save();
        //Шифровання id юзеру в базі даних використовуючи токен, який перестає бути валідним через 30 днів
        const token = jwt.sign({
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d'
            }
        );

        //Видаляємо passwordHash з відповіді
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token
        })
        // При наявності будь-якої помилки при реєстрації вивести код 500 + повернути меседж

    }catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося зареєструватися'
        })
    }

};

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        //Після введення даних користувачем, шукаємо такого користувача в БД
        const user = await UserModel.findOne({ UserEmail: req.body.UserEmail });

        //Якщо користувача не знайдено, вивести помилку 404 та меседж
        if(!user){
            return res.status(404).json({
                message: 'Користувача не знайдено'
            })
        }

        //Перевірка введеного пароля з зашифрованим bcrypt паролем з БД
        const isValidPass = await bcrypt.compare(req.body.UserPassword, user._doc.passwordHash);
        if(!isValidPass){
            return res.status(400).json({
                message: 'Невірний логін або пароль'
            })
        }

        //Шифровання id юзеру в базі даних використовуючи токен, який перестає бути валідним через 30 днів
        const token = jwt.sign({
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d'
            }
        );
        //Видаляємо passwordHash з відповіді
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token
        })

    } catch(err){
        console.log(err)
        res.status(500).json({
            message: "Не вдалося увійти в акаунт"
        })
    }
};

export const getMe = async (req, res) => {
    try {
        //Дістаємо айді користувача з властивості req (json об'єкту запиту), а саме userId, який я створив у checkAuth та помістив у нього розшифрований зі стану токену айді користувача
        const user = await User.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message: 'Користувача не знайдено'
            })
        }

        const {passwordHash, ...userData} = user._doc;
        res.json({userData})
    } catch(err){
        console.log(err);
        res.status(404).json({
            message: 'Нема доступу'
        })
    }
};

export const editUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const userId = req.userId; // Виносимо userId з запиту, який з'явився там після виконання функції checkAuth

        // Перевіряємо, чи існує користувач з таким ID
        const existingUser = await User.findById(req.userId);
        if (!existingUser) {
            return res.status(404).json({
                message: 'Користувача не знайдено'
            });
        }

        // Обновляем только те поля, которые переданы в запросе
        if (req.body.UserFirstName) {
            existingUser.UserFirstName = req.body.UserFirstName;
        }
        if (req.body.UserLastName) {
            existingUser.UserLastName = req.body.UserLastName;
        }
        if (req.body.UserAvatarUrl) {
            existingUser.UserAvatarUrl = req.body.UserAvatarUrl;
        }

        // Сохраняем обновленного пользователя
        const updatedUser = await existingUser.save();

        // Возвращаем обновленные данные пользователя без пароля
        const { passwordHash, ...userData } = updatedUser._doc;
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося оновити інформацію користувача'
        });
    }
};

