// backend/routes/boxRoutes.ts
import express from 'express';
import BoxController from '../controllers/boxController';

const router = express.Router();
const boxController = new BoxController();

router.post('/boxes', boxController.createBox.bind(boxController));
router.get('/boxes', boxController.getBoxes.bind(boxController));
router.get('/boxes/slug/:slug', boxController.getBoxBySlug.bind(boxController));
router.put('/boxes/:id', boxController.updateBox.bind(boxController));
router.delete('/boxes/:id', boxController.deleteBox.bind(boxController));

export default router;
