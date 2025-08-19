// backend/app.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import foodRoutes from './routes/foodRoutes';
import userRoutes from './routes/userRoutes';
import boxRoutes from './routes/boxRoutes';
import orderRoutes from './routes/orderRoutes';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/fooddb')
    .then(() => console.log('Kết nối MongoDB thành công!'))
    .catch((err) => console.error('Kết nối MongoDB thất bại:', err));

app.use('/api', foodRoutes);
app.use('/api', userRoutes);
app.use('/api', boxRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, 'localhost', () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});