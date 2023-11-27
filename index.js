import express from 'express';
import mongoose from 'mongoose';

import checkAuth from "./utils/checkAuth.js";
import * as userValidations from "./validations/userValidation.js";
import * as UserController from "./controllers/UserController.js";

import * as CompanyController from "./controllers/CompanyController.js";
import * as CompanyValidations from "./validations/companyValidation.js";

import * as RoomValidations from "./validations/roomValidation.js";
import * as RoomController from "./controllers/RoomController.js";

import * as WorkerController from "./controllers/WorkerController.js";
import * as WorkerValidations from "./validations/workerValidation.js";

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB ok"))
    .catch((err) => console.log("DB error", err))

const app = express();
app.use(express.json());

app.post('/auth/login', userValidations.loginValidation, UserController.login);
app.post('/auth/register', userValidations.registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe);
app.patch('/auth/edit', userValidations.editValidation, checkAuth, UserController.editUser);

app.post('/company/create', checkAuth, CompanyValidations.createValidation, CompanyController.createCompany);
app.patch('/company/edit/:id', checkAuth, CompanyValidations.editValidation, CompanyController.editCompany);
app.post('/company/add-user/:id', checkAuth, CompanyValidations.addUserValidation, CompanyController.addUserToCompany);
app.delete('/company/remove-user/:companyId/:roleId', checkAuth, CompanyController.removeUserFromCompany);
app.delete('/company/delete/:id', checkAuth, CompanyController.deleteCompany);

app.post('/company/:companyId/create/room', checkAuth, RoomValidations.createValidation, RoomController.createRoom);
app.post('/company/:companyId/room/:roomId/create/doorway', checkAuth, RoomController.createDoorway);
app.post('/company/:companyId/room/:roomId/add-doorway/:doorwayId', checkAuth, RoomController.addDoorwayToRoom);
app.delete('/company/:companyId/room/:roomId/delete/doorway/:doorwayId', checkAuth, RoomController.deleteDoorwayFromRoom);
app.delete('/company/:companyId/room/:roomId/delete/room', checkAuth, RoomController.deleteRoom);
app.patch('/company/:companyId/edit/room/:roomId', checkAuth, RoomController.editRoomName);

app.post('/company/:companyId/create/worker', checkAuth, WorkerValidations.createValidation, WorkerController.createWorker);
app.patch('/company/:companyId/edit/worker/:workerId', checkAuth, WorkerValidations.editValidation, WorkerController.editWorker);


//запускаємо сервер, якщо є помилка - вивести її, якщо ні, то ServerOK
app.listen(4444, (err) => {
    if(err){
        return console.log(err);
    }

    console.log("Server OK")
})