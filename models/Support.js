import mongoose from 'mongoose';

const SupportShema = new mongoose.Schema({
        Email: {
            type: String,
            required: true
        },
        Name: {
            type: String,
            required: true
        },
        PhoneNumber: {
            type: String,
            required: true
        },
        Title: {
            type: String,
            required: true
        },
        Description: {
            type: String,
            required: true
        },
        Solved: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true
    });

export default mongoose.model('Support', SupportShema);
