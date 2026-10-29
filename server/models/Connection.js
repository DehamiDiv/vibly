import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
    sender: { type: String, ref: 'User', required: true },
    receiver: { type: String, ref: 'User', required: true },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'], 
        default: 'pending' 
    },
}, { timestamps: true });

connectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const Connection = mongoose.models.Connection || mongoose.model('Connection', connectionSchema);

export default Connection;

