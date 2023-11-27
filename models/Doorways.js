import mongoose from "mongoose";

const DoorwaysSchema = new mongoose.Schema({
    RoomID: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rooms',
            required: true
        }],
        validate: {
            validator: function(arr) {
                return arr.length <= 2; // Allow a maximum of 2 rooms
            },
            message: 'Дверний отвір може містити максимум 2 кімнати.'
        }
    }
}, {
    timestamps: true
});


export default mongoose.model('Doorways', DoorwaysSchema);
