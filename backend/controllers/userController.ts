import { Request, Response } from 'express';
import User from '../models/user';

export default class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const user = new User(req.body);
            await user.save();
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    async getUsers(_req: Request, res: Response) {
        const users = await User.find();
        res.json(users);
    }

    async getUser(req: Request, res: Response) {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Not found' });
        res.json(user);
    }

    async updateUser(req: Request, res: Response) {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    }

    async deleteUser(req: Request, res: Response) {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    }
}