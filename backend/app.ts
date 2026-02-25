import express from "express";
import cors from "cors";
import foodRoutes from "./routes/foodRoutes";
import userRoutes from "./routes/userRoutes";
import boxRoutes from "./routes/boxRoutes";
import orderRoutes from "./routes/orderRoutes";
import connectDB from "./config/db";

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());
connectDB();
app.get("/", (req, res) => {
    res.send("Backend OK");
});


app.use("/api/foods", foodRoutes);
app.use("/api/users", userRoutes);
app.use("/api/boxes", boxRoutes);
app.use("/api/orders", orderRoutes);

app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
});

app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});
