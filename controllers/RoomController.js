import User from "../models/User.js";
import CompanyModel from "../models/Company.js";
import UserRolesModel from "../models/UserRoles.js";
import RoomModel from "../models/Rooms.js";
import DoorwayModel from "../models/Doorways.js";
import {validationResult} from "express-validator";

export const createRoom = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const companyId = req.params.companyId;

        const roomWithThisNameAlreadyExist = await RoomModel.findOne({
            RoomName: req.body.RoomName
        });

        if (roomWithThisNameAlreadyExist) {
            console.log(roomWithThisNameAlreadyExist);
            return res.status(500).json({
                message: "Кімната з таким ім'ям вже існує"
            });
        }

        const createdRoom = new RoomModel({
            RoomName: req.body.RoomName,
            CompanyID: companyId
        });

        await createdRoom.save();
        return res.json(createdRoom);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не створити кімнату'
        });
    }
};

export const editRoomName = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const roomId = req.params.roomId;
        const { NewRoomName } = req.body;

        // Проверка существования комнаты
        const existingRoom = await RoomModel.findById(roomId);
        if (!existingRoom) {
            return res.status(404).json({
                message: 'Кімнату не знайдено'
            });
        }

        // Проверка принадлежности комнаты к компании
        const isRoomExistInCompany = await RoomModel.findOne({
            _id: roomId,
            CompanyID: companyId
        });
        if (!isRoomExistInCompany) {
            return res.status(500).json({
                message: 'Цієї кімнати не існує в даній компанії'
            });
        }

        // Проверка наличия нового названия комнаты
        if (!NewRoomName) {
            return res.status(400).json({
                message: 'Нова назва кімнати не вказана'
            });
        }

        // Проверка на уникальность нового названия
        const roomWithNewNameExists = await RoomModel.findOne({
            _id: { $ne: roomId },
            RoomName: NewRoomName
        });

        if (roomWithNewNameExists) {
            return res.status(500).json({
                message: 'Кімната з таким ім\'ям вже існує'
            });
        }

        // Обновление названия комнаты
        const updatedRoom = await RoomModel.findByIdAndUpdate(
            roomId,
            { RoomName: NewRoomName },
            { new: true }
        );

        return res.json({
            message: 'Назва кімнати змінена успішно',
            updatedRoom
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Не вдалося змінити назву кімнати'
        });
    }
};

export const createDoorway = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const connectedRoomID = req.params.roomId;
        const companyWithDoorway = await CompanyModel.findById(companyId);
        const roomWithDoorway = await RoomModel.findById(connectedRoomID);
        if (companyWithDoorway) {
            const doorwayDoc = new DoorwayModel;
            doorwayDoc.RoomID.push(connectedRoomID);
            roomWithDoorway.DoorwayID.push(doorwayDoc._id);
            await roomWithDoorway.save();
            await doorwayDoc.save();
            return res.json({doorwayDoc, roomWithDoorway});
        } else {
            return res.status(404).json({
                message: 'Компанія не знайдена'
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не вдалося створити двірний отвір'
        });
    }
}

export const addDoorwayToRoom = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const roomId = req.params.roomId;
        const doorwayId = req.params.doorwayId;

        const isDoorwayExistInRoom = await RoomModel.findOne({
            _id: roomId,
            DoorwayID: { $in: [doorwayId] }
        });

        if (isDoorwayExistInRoom) {
            return res.status(500).json({
                message: "Цей дверний отвір вже присутній в цій кімнаті"
            });
        }

        const doorwayModel = await DoorwayModel.findById(doorwayId);

        if (!doorwayModel) {
            return res.status(500).json({
                message: "Дверний отвір не знайдено"
            });
        }

        if (doorwayModel.RoomID.length >= 2) {
            return res.status(500).json({
                message: "Цей двірний отвір вже об'єднує дві кімнати"
            });
        }

        const isRoomExistInCompany = await RoomModel.findOne({
            _id: roomId,
            CompanyID: companyId
        });

        if (!isRoomExistInCompany) {
            return res.status(500).json({
                message: 'Цієї кімнати не існує в даній компанії'
            });
        }

        const updatedRoom = await RoomModel.findByIdAndUpdate(
            roomId,
            { $push: { DoorwayID: doorwayId } },
            { new: true }
        );

        doorwayModel.RoomID.push(roomId);
        await doorwayModel.save();

        return res.json(updatedRoom);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не вдалося додати отвір до кімнати'
        });
    }
};

export const deleteDoorwayFromRoom = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const roomId = req.params.roomId;
        const doorwayId = req.params.doorwayId;

        const existingRoom = await RoomModel.findById(roomId);
        if (!existingRoom) {
            return res.status(404).json({
                message: 'Кімнату не знайдено'
            });
        }

        const isRoomExistInCompany = await RoomModel.findOne({
            _id: roomId,
            CompanyID: companyId
        });
        if (!isRoomExistInCompany) {
            return res.status(500).json({
                message: 'Цієї кімнати не існує в даній компанії'
            });
        }

        // Remove the doorwayId from the RoomModel.DoorwayID array
        const updatedRoom = await RoomModel.findByIdAndUpdate(
            roomId,
            { $pull: { DoorwayID: doorwayId } },
            { new: true }
        );

        // Check if the roomId exists in the DoorwayModel
        const thisDoorway = await DoorwayModel.findById(doorwayId);

        if (!thisDoorway) {
            return res.status(500).json({
                message: "Дверний отвір не знайдено"
            });
        }

        // Remove the roomId from the DoorwayModel.RoomID array
        thisDoorway.RoomID = thisDoorway.RoomID.filter(id => id.toString() !== roomId);
        if (thisDoorway.RoomID.length === 0) {
            await DoorwayModel.deleteOne({ _id: doorwayId });
        } else {
            // Save the updated DoorwayModel if RoomID is not empty
            await thisDoorway.save();
        }
        return res.json(updatedRoom);
        console.log(`Doorway ${doorwayId} removed from Room ${roomId}`);

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не вдалося видалити двірний отвір'
        });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const roomId = req.params.roomId;

        // Проверка существования комнаты
        const existingRoom = await RoomModel.findById(roomId);
        if (!existingRoom) {
            return res.status(404).json({
                message: 'Кімнату не знайдено'
            });
        }

        // Проверка принадлежности комнаты к компании
        const isRoomExistInCompany = await RoomModel.findOne({
            _id: roomId,
            CompanyID: companyId
        });
        if (!isRoomExistInCompany) {
            return res.status(500).json({
                message: 'Цієї кімнати не існує в даній компанії'
            });
        }

        // Удаление комнаты из базы данных
        const deletedRoom = await RoomModel.findByIdAndDelete(roomId);

        // Удаление дверных проемов, связанных с комнатой
        for (const doorwayId of deletedRoom.DoorwayID) {
            const doorway = await DoorwayModel.findById(doorwayId);

            if (!doorway) {
                // Этот случай не должен произойти, но для безопасности проверим
                console.error(`Дверний отвір ${doorwayId} не знайдено.`);
                continue;
            }

            // Удаление комнаты из списка связанных с дверным проемом
            doorway.RoomID = doorway.RoomID.filter(id => id.toString() !== roomId);

            if (doorway.RoomID.length === 0) {
                // Если не осталось связанных комнат, удалить дверной проем
                await DoorwayModel.findByIdAndDelete(doorwayId);
            } else {
                // В противном случае сохранить обновленный дверной проем
                await doorway.save();
            }
        }

        return res.json({
            message: 'Кімната та пов\'язані дверні отвори видалені успішно',
            deletedRoom
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Не вдалося видалити кімнату та пов\'язані дверні отвори'
        });
    }
};









