import mongoose from 'mongoose';

const RoomsSchema = new mongoose.Schema({
        RoomName: {
            type: String,
            required: true
        },
        CompanyID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        DoorwayID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doorways',
            required: false
        }]
    },
    {
        timestamps: true
    });

export default mongoose.model('Rooms', RoomsSchema);
