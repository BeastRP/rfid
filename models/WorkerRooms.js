import mongoose from 'mongoose';

const WorkerRoomsSchema = new mongoose.Schema({
        WorkerID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workers',
            required: true
        }],
        RoomID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rooms',
            required: true
        }]
    },
    {
        timestamps: true
    });

const WorkerRooms = mongoose.model('WorkerRooms', WorkerRoomsSchema);

export default WorkerRooms;
