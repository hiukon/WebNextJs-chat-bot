import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    paymentMethod: {
        type: String,
        enum: ['cod', 'momo', 'bank', 'card', 'zalo', 'shopee'],
        required: true
    },
    status: { type: String, default: 'pending' },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
