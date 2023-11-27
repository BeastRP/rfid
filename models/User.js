import mongoose from 'mongoose';

const UserShema = new mongoose.Schema({
        UserEmail: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        UserFirstName: {
            type: String,
            required: true
        },
        UserLastName: {
            type: String,
            required: true
        },
        UserAvatarUrl: {
            type: String,
            required: false
        },
        CompanyID: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Company',
                required: false
        }]
    },
    {
        timestamps: true
    }

);

export default mongoose.model('User', UserShema);