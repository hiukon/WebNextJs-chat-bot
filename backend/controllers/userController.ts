import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "SECRET_KEY";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "REFRESH_SECRET";

export default class UserController {
    // Đăng ký
    async register(req: Request, res: Response) {
        try {
            const { name, email, password, phone, address } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }

            // Hash mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // 👇 role mặc định là "user"
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

    // Đăng nhập
    async login(req: Request, res: Response) {

        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
            }

            // So sánh mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
            }

            // Sinh token
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

    // CREATE (admin chỉ tạo admin)
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

    // UPDATE
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

    // DELETE
    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await User.findByIdAndDelete(id);
            res.json({ message: "Xóa thành công" });
        } catch (err) {
            res.status(500).json({ message: "Lỗi server" });
        }
    }

    // PROFILE (dùng authMiddleware)
    async getProfile(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Thiếu token" });
            }

            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

            const user = await User.findById(decoded.userId).select("-password");
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy user" });
            }

            res.json(user);
        } catch (err) {
            res.status(401).json({ message: "Token không hợp lệ", error: err });
        }
    }
}
