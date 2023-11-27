import User from "../models/User.js";
import CompanyModel from "../models/Company.js";
import UserRolesModel from "../models/UserRoles.js";
import RoomModel from "../models/Rooms.js";
import DoorwayModel from "../models/Doorways.js";
import WorkerModel from "../models/Workers.js";
import WorkerRoomsModel from "../models/WorkerRooms.js";
import {validationResult} from "express-validator";
import UserRoles from "../models/UserRoles.js";
import moment from 'moment';

export const createWorker = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const isCompanyExist = await CompanyModel.findById(companyId);
        if (!isCompanyExist) {
            return res.status(403).json({
                message: "Компанії до якої Ви намагаєтеся додати робітника не існує"
            });
        }
        const companyId = req.params.companyId;
        const rfidKeyAlreadyExist = await WorkerModel.findOne({ RFIDKey: req.body.RFIDKey });
        if (rfidKeyAlreadyExist) {
            return res.status(500).json({
                message: 'Робітник з таким RFID ключем вже існує'
            });
        }



        const userId = req.userId;
        const userRole = await UserRolesModel.findOne({
            CompanyID: companyId,
            isCreator: true,
            UserID: userId
        });

        if (!userRole) {
            return res.status(403).json({
                message: "Ви не маєте прав доступу до цієї компанії"
            });
        }

        const doc = new WorkerModel({
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            BirthDate: req.body.BirthDate,
            RFIDKey: req.body.RFIDKey,
            WorkStartTime: req.body.WorkStartTime,
            WorkEndTime: req.body.WorkEndTime,
            BreakStartTime: req.body.BreakStartTime,
            BreakEndTime: req.body.BreakEndTime,
            WorksInWeekend: req.body.WorksInWeekend,
            CompanyID: companyId,
            WorkingRoom: req.body.WorkingRoom
        });

        const parseTimeString = (timeString) => {
            const [hours, minutes] = timeString.split(':').map(Number);
            return new Date(2000, 0, 1, hours, minutes);
        };

        // Проверка времени работы и перерыва
        if (req.body.WorkStartTime && req.body.WorkEndTime) {
            const startTime = parseTimeString(req.body.WorkStartTime);
            const endTime = parseTimeString(req.body.WorkEndTime);

            if (startTime > endTime) {
                return res.status(400).json({
                    message: "Невірний час роботи. Початковий час не може бути пізніше за кінцевий час."
                });
            }
        }

        if (req.body.BreakStartTime && req.body.BreakEndTime) {
            const breakStartTime = parseTimeString(req.body.BreakStartTime);
            const breakEndTime = parseTimeString(req.body.BreakEndTime);

            if (breakStartTime > breakEndTime) {
                return res.status(400).json({
                    message: "Невірний час перерви. Початковий час не може бути пізніше за кінцевий час."
                });
            }

            if (req.body.WorkEndTime && breakEndTime > parseTimeString(req.body.WorkEndTime)) {
                return res.status(400).json({
                    message: "Невірний час перерви. Кінцевий час перерви не може бути пізніше за кінцевий час роботи."
                });
            }
        }

        if (req.body.WorkStartTime && req.body.BreakStartTime && parseTimeString(req.body.BreakStartTime) < parseTimeString(req.body.WorkStartTime)) {
            return res.status(400).json({
                message: "Невірний час перерви. Початковий час перерви не може бути раніше за початковий час роботи."
            });
        }

        const worker = await doc.save();
        res.json(worker);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Не вдалося створити робітника"
        });
    }
};

export const editWorker = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const workerId = req.params.workerId;
        const isCompanyExist = await CompanyModel.findById(companyId);
        if (!isCompanyExist) {
            return res.status(403).json({
                message: "Компанії в якій Ви намагаєтеся змінити робітника не існує"
            });
        }

        const rfidKeyAlreadyExist = await WorkerModel.findOne({ RFIDKey: req.body.RFIDKey });
        if (rfidKeyAlreadyExist) {
            return res.status(500).json({
                message: 'Робітник з таким RFID ключем вже існує'
            });
        }

        const userId = req.userId;
        const userRole = await UserRolesModel.findOne({
            CompanyID: companyId,
            isCreator: true,
            UserID: userId
        });

        if (!userRole) {
            return res.status(403).json({
                message: "Ви не маєте прав доступу до цієї компанії"
            });
        }


        const thisWorker = await WorkerModel.findById(workerId)


        if (req.body.FirstName) {
            thisWorker.FirstName = req.body.FirstName.trim();
        } else req.body.FirstName = thisWorker.FirstName;
        if (req.body.LastName) {
            thisWorker.LastName = req.body.LastName.trim();
        } else req.body.LastName = thisWorker.LastName;
        if (req.body.RFIDKey) {
            thisWorker.RFIDKey = req.body.RFIDKey.trim();
        } else req.body.RFIDKey = thisWorker.RFIDKey;
        if (req.body.WorkStartTime) {
            thisWorker.WorkStartTime = req.body.WorkStartTime.trim();
        } else req.body.WorkStartTime = thisWorker.WorkStartTime;
        if (req.body.WorkEndTime) {
            thisWorker.WorkEndTime = req.body.WorkEndTime.trim();
        } else req.body.WorkEndTime = thisWorker.WorkEndTime;
        if (req.body.BreakStartTime) {
            thisWorker.BreakStartTime = req.body.BreakStartTime.trim();
        } else req.body.BreakStartTime = thisWorker.BreakStartTime;
        if (req.body.BreakEndTime) {
            thisWorker.BreakEndTime = req.body.BreakEndTime.trim();
        } else req.body.BreakEndTime = thisWorker.BreakEndTime;
        if (req.body.WorksInWeekend !== undefined) {
            thisWorker.WorksInWeekend = req.body.WorksInWeekend;
        } else req.body.WorksInWeekend = thisWorker.WorksInWeekend;
        if (req.body.WorkingRoom && Array.isArray(req.body.WorkingRoom)) {
            const newWorkingRooms = req.body.WorkingRoom;
            
            const existingRooms = newWorkingRooms.filter(room => thisWorker.WorkingRoom.includes(room));

            if (existingRooms.length > 0) {
                return res.status(400).json({
                    message: `Ці кімнати вже присутні у списку робочих кімнат даного робітника: ${existingRooms.join(', ')}`
                });
            }

            thisWorker.WorkingRoom.push(...newWorkingRooms);
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const parseTimeString = (timeString) => {
            const [hours, minutes] = timeString.split(':').map(Number);
            return new Date(2000, 0, 1, hours, minutes);
        };

        // Проверка времени работы и перерыва
        if (req.body.WorkStartTime && req.body.WorkEndTime) {
            const startTime = parseTimeString(req.body.WorkStartTime);
            const endTime = parseTimeString(req.body.WorkEndTime);

            if (startTime > endTime) {
                return res.status(400).json({
                    message: "Невірний час роботи. Початковий час не може бути пізніше за кінцевий час."
                });
            }
        }

        if (req.body.BreakStartTime && req.body.BreakEndTime) {
            const breakStartTime = parseTimeString(req.body.BreakStartTime);
            const breakEndTime = parseTimeString(req.body.BreakEndTime);

            if (breakStartTime > breakEndTime) {
                return res.status(400).json({
                    message: "Невірний час перерви. Початковий час не може бути пізніше за кінцевий час."
                });
            }

            if (req.body.WorkEndTime && breakEndTime > parseTimeString(req.body.WorkEndTime)) {
                return res.status(400).json({
                    message: "Невірний час перерви. Кінцевий час перерви не може бути пізніше за кінцевий час роботи."
                });
            }
        }

        if (req.body.WorkStartTime && req.body.BreakStartTime && parseTimeString(req.body.BreakStartTime) < parseTimeString(req.body.WorkStartTime)) {
            return res.status(400).json({
                message: "Невірний час перерви. Початковий час перерви не може бути раніше за початковий час роботи."
            });
        }

        await thisWorker.save();

        return res.status(200).json(thisWorker);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Не вдалося змінити дані робітника"
        });
    }
};

export const deleteWorker = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const workerId = req.params.workerId;

        const isCompanyExist = await CompanyModel.findById(companyId);
        if (!isCompanyExist) {
            return res.status(403).json({
                message: "Компанії, в якій ви намагаєтеся видалити робітника, не існує"
            });
        }

        const userId = req.userId;
        const userRole = await UserRolesModel.findOne({
            CompanyID: companyId,
            isCreator: true,
            UserID: userId
        });

        if (!userRole) {
            return res.status(403).json({
                message: "Ви не маєте прав доступу до цієї компанії"
            });
        }

        const deletedWorker = await WorkerModel.findByIdAndDelete(workerId);

        if (!deletedWorker) {
            return res.status(404).json({
                message: "Робітник не знайдений"
            });
        }

        res.status(200).json({
            message: "Робітник успішно видалений",
            deletedWorker
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Не вдалося видалити робітника"
        });
    }
};





