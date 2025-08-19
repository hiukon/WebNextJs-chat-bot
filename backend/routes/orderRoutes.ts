import express from 'express';
import OrderController from '../controllers/orderController';

const router = express.Router();
const orderController = new OrderController();

router.post('/', orderController.createOrder.bind(orderController));//admin
router.get('/:id/details', orderController.getOrderDetails.bind(orderController));
router.get('/', orderController.getAllOrders.bind(orderController)); // GET /api/orders


export default router;
