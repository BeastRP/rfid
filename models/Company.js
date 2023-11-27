import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
        CompanyName: {
            type: String,
            required: true,
            unique: true
        },
        CompanyAvatarUrl: {
            type: String,
            required: false,
            unique: false
        },
        UserID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }]
    },
    {
        timestamps: true
    });

export default mongoose.model('Company', CompanySchema);


