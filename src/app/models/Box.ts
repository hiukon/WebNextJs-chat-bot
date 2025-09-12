import mongoose, { Schema, Document, models } from "mongoose";

export interface IBox extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    slug: string;
}

const BoxSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
});


const Box = models.Box || mongoose.model<IBox>("Box", BoxSchema);

export default Box;
