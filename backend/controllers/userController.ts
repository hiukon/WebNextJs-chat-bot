import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "SECRET_KEY";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "REFRESH_SECRET";

export default class UserController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password, phone, address } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                name,
                email,
                password: hashedPassword,
                phone,
                address,
                role: "user"
            });
            await user.save();
            res.status(201).json({
                message: "Đăng ký thành công",
                user: {
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: user.role,
                }
            });
        } catch (err) {
            res.status(500).json({ message: "Lỗi server", error: err });
        }
    }
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
            }
            const token = jwt.sign({ userId: user._id }, ACCESS_SECRET, { expiresIn: "15m" });
            const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: "7d" });
            return res.json({
                message: "Đăng nhập thành công",
                token,
                refreshToken,
                user: {
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: user.role,
                }
            });
        } catch (err) {
            return res.status(500).json({ message: "Lỗi đăng nhập", error: err });
        }
    }
    async createUser(req: Request, res: Response) {
        try {
            const { name, email, password, phone, address } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                name,
                email,
                password: hashedPassword,
                phone,
                address,
                role: "admin",
            });
            await user.save();

            res.status(201).json(user);
        } catch (err) {
            res.status(500).json({ message: "Lỗi server", error: err });
        }
    }
    async getUsers(req: Request, res: Response) {
        try {
            const users = await User.find().select("-password");
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;
            if (data.password) {
                data.password = await bcrypt.hash(data.password, 10);
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true }).select("-password");
            res.json(updatedUser);
        } catch (err) {
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await User.findByIdAndDelete(id);
            res.json({ message: "Xóa thành công" });
        } catch (err) {
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async getProfile(req: Request, res: Response) {
        try {
            if (!req.userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const user = await User.findById(req.userId).select("-password");
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy user" });
            }
            return res.json(user);
        } catch (err) {
            return res.status(500).json({ message: "Lỗi server" });
        }
    }
    async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { name, email, phone, address } = req.body;
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { name, email, phone, address },
                { new: true }
            );
            res.json(updatedUser);
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    };
}