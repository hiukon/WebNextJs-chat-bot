import express from "express";
import FoodController from "../controllers/foodController";

const router = express.Router();
const foodController = new FoodController();

// CRUD
router.post("/", foodController.createFood.bind(foodController));
router.get("/", foodController.getFoods.bind(foodController));
router.get("/slug/:slug", foodController.getFoodBySlug.bind(foodController));
router.put("/:id", foodController.updateFood.bind(foodController));
router.delete("/:id", foodController.deleteFood.bind(foodController));

export default router;
