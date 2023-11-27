const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rfidEventSchema = new Schema({
    WorkerID: {
        type: Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    RoomID: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    EventType: {
        type: String,
        required: true
    },
    EventTime: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const RFIDEvent = mongoose.model('RFIDEvent', rfidEventSchema);
module.exports = RFIDEvent;
