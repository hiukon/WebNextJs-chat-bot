import mongoose from 'mongoose';

const BoxSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    slug: { type: String, unique: true },
});

export default mongoose.model("Box", BoxSchema);


