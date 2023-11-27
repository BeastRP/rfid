const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const warningSchema = new Schema({
    WorkerID: {
        type: Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    WarningTime: {
        type: Date,
        required: true
    }
});

const Warning = mongoose.model('Warning', warningSchema);
module.exports = Warning;
