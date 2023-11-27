import mongoose from 'mongoose';

const WorkersSchema = new mongoose.Schema({
        FirstName: {
            type: String,
            required: true
        },
        LastName: {
            type: String,
            required: true
        },
        RFIDKey: {
            type: String,
            required: true
        },
        WorkStartTime: {
            type: String,
            required: true,
        },
        WorkEndTime: {
            type: String,
            required: true,
        },
        BreakStartTime: {
            type: String,
            required: true,
        },
        BreakEndTime: {
            type: String,
            required: true,
        },
        WorksInWeekend: {
            type: Boolean,
            required: true
        },
        CompanyID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        WorkingRoom: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Rooms',
                required: true
        }],
    },
    {
        timestamps: true
    });

export default mongoose.model('Workers', WorkersSchema);
