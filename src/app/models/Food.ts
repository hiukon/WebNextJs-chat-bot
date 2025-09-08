// models/Food.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface IFood extends Document {
    name: string;
    price: string;
    image: string;
    category: string;
    slug: string;
}

const FoodSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
});

// tránh lỗi khi gọi nhiều lần trên Next.js
const Food = models.Food || mongoose.model<IFood>("Food", FoodSchema);

export default Food;
