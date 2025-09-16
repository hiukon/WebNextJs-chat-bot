import { Request, Response } from 'express';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';

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
            const order = await Order.findById(orderId);

            if (!order) {
                res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            } else {
                const items = await OrderItem.find({ orderId });

                res.status(200).json({
                    id: order.id,
                    userId: order.userId,
                    totalPrice: order.totalPrice,
                    status: order.status,
                    paymentMethod: order.paymentMethod,
                    createdAt: order.createdAt,
                    items,
                });
            }
        } catch (error) {
            console.error('Lỗi lấy đơn hàng:', error);
            res.status(500).json({ message: 'Không thể lấy đơn hàng' });
        }
    }
    async getAllOrders(req: Request, res: Response) {
        try {
            const orders = await Order.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: 'id',
                        as: 'userInfo'
                    }
                },
                { $unwind: '$userInfo' },
                {
                    $project: {
                        orderId: 1,
                        _id: 0,
                        userName: '$userInfo.name',
                        totalPrice: 1,
                        status: 1,
                        paymentMethod: 1,
                        createdAt: 1
                    }
                },
                { $sort: { createdAt: -1 } }
            ]);

            res.json(orders);
        } catch (error) {
            console.error('Lỗi lấy danh sách đơn hàng:', error);
            res.status(500).json({ message: 'Không lấy được danh sách đơn hàng' });
        }
    }

}

export default OrderController;