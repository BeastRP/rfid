const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RFIDDoorwaysSchema = new Schema({
        DoorwayID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doorways',
            required: true
        },
        RoomIDs: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Rooms',
                    required: true
                }
            ],
            validate: {
                validator: function (value) {
                    return value.length <= 2;
                },
                message: "Дверний отвір може з'єднувати максимум 2 кімнати."
            },
            required: true
        },
    },
    {
        timestamps: true
    });

// Добавляем уникальный индекс для DoorwayID
RFIDDoorwaysSchema.index({ DoorwayID: 1 }, { unique: true });

const RFIDDoorways = mongoose.model('RFIDDoorways', RFIDDoorwaysSchema);
module.exports = RFIDDoorways;
