import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    productId: String,
    productSlug: String,
    productName: String,
    productImage: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
    options: {
        size: String,
        toppings: [String]
    }
});


const OrderItem = mongoose.model('OrderItem', OrderItemSchema);
export default OrderItem;
