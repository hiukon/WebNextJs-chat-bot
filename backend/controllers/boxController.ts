import { Request, Response } from 'express';
import Box from '../models/box';

export default class BoxController {
    async createBox(req: Request, res: Response) {
        try {
            const box = new Box(req.body);
            await box.save();
            res.status(201).json(box);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }
    async getBoxes(_req: Request, res: Response) {
        const boxes = await Box.find();
        res.json(boxes);
    }

    async getBox(req: Request, res: Response) {
        const box = await Box.findById(req.params.id);
        if (!box) return res.status(404).json({ error: 'Not found' });
        res.json(box);
    }

    async updateBox(req: Request, res: Response) {
        const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(box);
    }

    async deleteBox(req: Request, res: Response) {
        await Box.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    }
    async getBoxBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const box = await Box.findOne({ slug });

            if (!box) {
                res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }
            res.status(200).json(box);
        } catch (error) {
            console.error("Lỗi khi tìm box theo slug:", error);
            res.status(500).json({ message: 'Lỗi server', error });
        }

    }


}

