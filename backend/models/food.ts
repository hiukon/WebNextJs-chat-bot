// backend/models/food.ts
import mongoose from 'mongoose';

const FoodSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    category: String,
    slug: { type: String, unique: true },
});

export default mongoose.model('Food', FoodSchema);
