import mongoose from 'mongoose';

const UserRolesShema = new mongoose.Schema({
        RoleName: {
            type: String,
            required: true,
            unique: false
        },
        CompanyID: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Company',
                required: true
        }],
        UserID: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
        }],
        isCreator: {
            type: Boolean,
            required: true
        }



    },
    {
        timestamps: true
    }

);

export default mongoose.model('UserRoles', UserRolesShema);