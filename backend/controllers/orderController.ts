import { Request, Response } from 'express';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import mongoose from 'mongoose';

class OrderController {

    async createOrder(req: Request, res: Response) {

        try {
            const { userId, paymentMethod, items } = req.body;
            const totalPrice = items.reduce(
                (sum: number, item: { totalPrice: number }) => sum + item.totalPrice,
                0
            );
            const newOrder = await Order.create({
                userId,
                paymentMethod,
                status: 'pending',
                totalPrice,
                createdAt: new Date(),
            });

            const orderItems = items.map((item: any) => ({
                ...item,
                orderId: newOrder._id,
            }));

            await OrderItem.insertMany(orderItems);


            res.status(201).json({ message: 'Đặt hàng thành công', orderId: newOrder._id });
        } catch (error: any) {
            console.error(' Lỗi tạo đơn hàng:', error.message || error);
            res.status(500).json({ message: 'Tạo đơn hàng thất bại', error: error.message });
        }
    }

    async getOrderDetails(req: Request, res: Response) {
        try {
            const orderId = req.params.id;
            const _id = new mongoose.Types.ObjectId(orderId);

            const order = await Order.aggregate([
                { $match: { _id } },
                {
                    $addFields: {
                        userIdObj: {
                            $cond: [
                                { $eq: [{ $type: "$userId" }, "string"] },
                                { $toObjectId: "$userId" },
                                "$userId"
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userIdObj",
                        foreignField: "_id",
                        as: "userInfo"
                    }
                },
                { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "orderitems",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "items"
                    }
                },
                {
                    $project: {
                        Id: "$_id",
                        _id: 0,
                        user: {
                            _id: "$userInfo._id",
                            name: "$userInfo.name",
                        },
                        totalPrice: 1,
                        status: 1,
                        paymentMethod: 1,
                        createdAt: 1,
                        items: {
                            $map: {
                                input: "$items",
                                as: "item",
                                in: {
                                    productId: "$$item.productId",
                                    productName: "$$item.productName",
                                    quantity: "$$item.quantity",
                                    unitPrice: "$$item.unitPrice"
                                    // bỏ productImage, orderId, _id, totalPrice nếu không muốn
                                }
                            }
                        }
                    }
                }
            ]);

            if (!order || order.length === 0) {
                res.status(404).json({ message: "Không tìm thấy đơn hàng" });
            }

            res.status(200).json(order[0]);
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
            res.status(500).json({ message: "Không thể lấy đơn hàng" });
        }
    }

    async getAllOrders(req: Request, res: Response) {
        try {
            const orders = await Order.aggregate([
                {
                    $addFields: {
                        userIdObj: {
                            $cond: [
                                { $eq: [{ $type: "$userId" }, "string"] },
                                { $toObjectId: "$userId" },
                                "$userId"
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userIdObj",
                        foreignField: "_id",
                        as: "userInfo"
                    }
                },
                { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "orderitems",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "items"
                    }
                },
                {
                    $project: {
                        Id: "$_id",
                        _id: 0,
                        user: {
                            _id: "$userInfo._id",

                        },
                        totalPrice: 1,
                        status: 1,
                        paymentMethod: 1,
                        createdAt: 1,
                        items: {
                            $map: {
                                input: "$items",
                                as: "item",
                                in: {
                                    productId: "$$item.productId",
                                    quantity: "$$item.quantity"
                                }
                            }
                        }
                    }
                },
                { $sort: { createdAt: -1 } }
            ]);

            res.json(orders);
        } catch (error) {
            console.error("Lỗi lấy danh sách đơn hàng:", error);
            res.status(500).json({ message: "Không lấy được danh sách đơn hàng" });
        }
    }
}

export default OrderController;