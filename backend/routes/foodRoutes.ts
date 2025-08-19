// backend/routes/foodRoutes.ts
import express from 'express';
import FoodController from '../controllers/foodController';

const router = express.Router();
const foodController = new FoodController();

router.post('/foods', foodController.createFood.bind(foodController));
router.get('/foods', foodController.getFoods.bind(foodController));
router.get('/foods/slug/:slug', foodController.getFoodBySlug.bind(foodController));
router.put('/foods/:id', foodController.updateFood.bind(foodController));
router.delete('/foods/:id', foodController.deleteFood.bind(foodController));
export default router;
