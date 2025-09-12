import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    userId: string;
    name: string;
    email: string;
    password?: string;
    phone: string;
    address: string;
    role: "admin" | "user"; // giới hạn role
}

const userSchema: Schema = new Schema({
    userId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user" // mặc định khi đăng ký sẽ là user
    },
});

export default mongoose.models.User ||
    mongoose.model<IUser>("User", userSchema);
