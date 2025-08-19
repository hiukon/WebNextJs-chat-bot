import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    address: String,
    phone: String,
    role: String,
});

export default mongoose.model('User', userSchema);