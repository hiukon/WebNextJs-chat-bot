// backend/controllers/foodController.ts
import { Request, Response } from 'express';
import Food from '../models/food';

export default class FoodController {
    async createFood(req: Request, res: Response) {
        try {
            const food = new Food(req.body);
            await food.save();
            res.status(201).json(food);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    async getFoods(_req: Request, res: Response) {
        const foods = await Food.find();
        res.json(foods);
    }

    async getFood(req: Request, res: Response) {
        const food = await Food.findById(req.params.id);
        if (!food) return res.status(404).json({ error: 'Not found' });
        res.json(food);
    }

    async updateFood(req: Request, res: Response) {
        const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(food);
    }

    async deleteFood(req: Request, res: Response) {
        await Food.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    }

    async getFoodBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const food = await Food.findOne({ slug });
            if (!food) {
                res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }
            else {
                res.status(200).json(food);
            }
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    }
}