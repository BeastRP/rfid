import User from "../models/User.js";
import mongoose from "mongoose";
import CompanyModel from "../models/Company.js";
import UserRolesModel from "../models/UserRoles.js";
import RoomModel from "../models/Rooms.js";
import DoorwayModel from "../models/Doorways.js";
import WorkerModel from "../models/Workers.js";
import WorkerRoomsModel from "../models/WorkerRooms.js";
import {validationResult} from "express-validator";
import UserRoles from "../models/UserRoles.js";
import moment from 'moment';
import SupportModel from "../models/Support.js";

export const addTicket = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const doc = new SupportModel({
            Email: req.body.Email,
            Name: req.body.Name,
            PhoneNumber: req.body.PhoneNumber,
            Title: req.body.Title,
            Description: req.body.Description,
            Solved: false
        })

        const ticket = await doc.save();
        return res.json(ticket);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Не вдалося відправити ваше питання"
        })
    }
}

export const solveTicket = async (req, res) => {
    const ticketId = req.params.ticketId;

    try {



        // Find the ticket by its ID
        const ticket = await SupportModel.findById(ticketId);
        console.log("Received ticketId:", ticketId);
        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        // Check if the ticket is already solved
        if (ticket.Solved) {
            return res.status(400).json({
                message: "Ticket is already solved"
            });
        }

        // Update the ticket as solved
        ticket.Solved = true;

        // Save the updated ticket
        const updatedTicket = await ticket.save();

        return res.json(updatedTicket);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Failed to solve the ticket"
        });
    }
};