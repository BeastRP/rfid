import User from "../models/User.js";
import CompanyModel from "../models/Company.js";
import UserRolesModel from "../models/UserRoles.js";
import {validationResult} from "express-validator";

export const createCompany = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const user = await User.findById(req.userId);
        const companyAlreadyExist = await CompanyModel.findOne({CompanyName: req.body.CompanyName});
        if(companyAlreadyExist){
            return res.status(500).json({
                message: 'Така компанія вже існує'
            })
        }

        const doc = new CompanyModel({
            CompanyName: req.body.CompanyName,
            CompanyAvatarUrl: req.body.CompanyAvatarUrl,
            UserID: user._id
        });

        const giveCreatorAdminRole = new UserRolesModel({
            RoleName: 'Власник',
            UserID: req.userId,
            CompanyID: doc._id,
            isCreator: true,
        })
        if(!giveCreatorAdminRole){
            return res.status(500).json({
                message: 'Не вдалося зареєструвати власника'
            })
        }
        const company = await doc.save();
        await giveCreatorAdminRole.save();
        user.CompanyID.push(company._id);
        await user.save();
        // Вивести ім'я користувача в консоль
        console.log(`Вітаємо зі створенням компанії ${req.body.CompanyName} під керівництвом  ${user.UserFirstName} ${user.UserLastName}`);

        res.json(company);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не вдалося створити компанію'
        });
    }
};

export const editCompany = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const companyId = req.params.id;
        const isUserCreator = await UserRolesModel.findOne({UserID: req.userId, RoleName: 'Власник'});
        const company = await CompanyModel.findOne({ CompanyName: req.body.OldCompanyName, _id: companyId });

        if (!isUserCreator || !isUserCreator.isCreator) {
            return res.status(500).json({
                message: "Ви не являєтеся власником компанії або стара назва компанії не співпадає з ім'ям компанії, яку ви хочете змінити"
            });
        }

        if (!company) {
            return res.status(500).json({
                message: "Компанію з таким ім'ям не знайдено"
            });
        }

        // Порівнюємо значення req.userId з ObjectId у company.UserID
        if (req.userId.toString() !== company.UserID.toString()) {
            return res.status(500).json({ message: "Ви не можете змінити ім'я цієї компанії" });
        }

        const companyAlreadyExist = await CompanyModel.findOne({ CompanyName: req.body.NewCompanyName });
        if (companyAlreadyExist) {
            return res.status(500).json({
                message: 'Така компанія вже існує'
            });
        }

        // Змінює назву компанії, команда trim видаляє пробіли у кінці строки назви компанії
        if (req.body.NewCompanyName) {
            company.CompanyName = req.body.NewCompanyName.trim();
        }
        if (req.body.NewCompanyAvatarUrl) {
            company.CompanyAvatarUrl = req.body.NewCompanyAvatarUrl.trim();
        }
        await company.save();
        res.json(company);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося змінити назву компанії'
        });
    }
};

export const addUserToCompany = async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const companyId = req.params.id;
        const isUserCreator = await UserRolesModel.findOne({UserID: req.userId});
        const company = await CompanyModel.findOne({_id: companyId });

        if (!isUserCreator || !isUserCreator.isCreator) {
            return res.status(500).json({
                message: "Ви не являєтеся власником компанії"
            });
        }
        if (!company) {
            return res.status(500).json({
                message: 'Компанію не знайдено'
            });
        }
        const user = await User.findOne({
            UserFirstName: req.body.newUserFirstName,
            UserLastName: req.body.newUserLastName
        });

        if (!user) {
            return res.status(500).json({
                message: `Користувача з ім'ям ${newUserFirstName} ${newUserLastName} не знайдено`
            });
        }

        if (user.CompanyID.includes(companyId)) {
            return res.status(500).json({
                message: "Цей користувач вже присутній в даній компанії"
            });
        }

        const giveAdminRole = new UserRolesModel({
            RoleName: req.body.RoleName,
            CompanyID: companyId,
            UserID: user._id,
            isCreator: false,
        });
        await giveAdminRole.save();
        res.json(giveAdminRole);
        user.CompanyID.push(company._id);
        company.UserID.push(user._id);

        await user.save();
        await company.save();
    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося додати користувача'
        });
    }
};

export const removeUserFromCompany = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const roleId = req.params.roleId.toString(); // Convert roleId to string
        const isUserCreator = await UserRolesModel.findOne({ UserID: req.userId });
        const company = await CompanyModel.findOne({ _id: companyId });

        if (!isUserCreator || !isUserCreator.isCreator) {
            return res.status(500).json({
                message: "Ви не являєтеся власником компанії"
            });
        }

        if (!company) {
            return res.status(500).json({
                message: 'Компанію не знайдено'
            });
        }

        const user = await User.findOne({
            UserFirstName: req.body.newUserFirstName,
            UserLastName: req.body.newUserLastName
        });

        if (!user) {
            return res.status(500).json({
                message: `Користувача з ім'ям ${req.body.newUserFirstName} ${req.body.newUserLastName} не знайдено`
            });
        }

        if (user.isCreator) {
            return res.status(500).json({
                message: 'Не можливо видалити власника компанії'
            });
        }

        // Find the role in UserRolesModel
        const userRoleShema = await UserRolesModel.findOne({
            _id: roleId,
            UserID: user._id.toString(),
            CompanyID: company._id.toString()
        });


        if (!userRoleShema) {
            return res.status(500).json({
                message: 'Роль користувача в компанії не знайдена'
            });
        }

        const result = await UserRolesModel.findOneAndDelete({
            _id: roleId,
        });

        company.UserID.pull(user._id);
        await company.save();

        user.CompanyID.pull(company._id);
        await user.save();

        res.json({
            message: 'Користувача успішно видалено з компанії'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося видалити користувача'
        });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const isUserCreator = await UserRolesModel.findOne({UserID: req.userId, RoleName: 'Власник'});
        const company = await CompanyModel.findById(companyId);
        // const users = await User.find({ CompanyID: { $in: [companyId] } });

        if (!isUserCreator || !isUserCreator.isCreator) {
            return res.status(500).json({
                message: "Ви не являєтеся власником компанії або компанія не знайдена"
            });
        }

        if (!company) {
            return res.status(500).json({
                message: "Компанію з таким ім'ям не знайдено"
            });
        }

        const companyAlreadyExist = await CompanyModel.findOne({CompanyName: req.body.NewCompanyName});
        if (companyAlreadyExist) {
            return res.status(500).json({
                message: 'Така компанія вже існує'
            });
        }
        await User.updateMany({CompanyID: companyId}, {$pull: {CompanyID: companyId}});

        await User.find({CompanyID: companyId});

        await CompanyModel.deleteMany({
            _id: companyId,
        });

        await UserRolesModel.deleteMany({
            CompanyID: companyId
        });

        res.json({success: true});

    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося видалити компанію'
        });
    }
}