import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err.message);
        });

        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pingup';
        await mongoose.connect(uri);
    } catch (error) {
        console.warn('⚠️ MongoDB connection could not be established:', error.message);
        console.warn('💡 Tip: Ensure MongoDB is running locally or provide a cloud MONGODB_URI in .env');
    }
};

export default connectDB;

