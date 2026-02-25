import express from "express";
import BoxController from "../controllers/boxController";

const router = express.Router();
const boxController = new BoxController();

// CRUD
router.post("/", boxController.createBox.bind(boxController));
router.get("/", boxController.getBoxes.bind(boxController));
router.get("/slug/:slug", boxController.getBoxBySlug.bind(boxController));
router.put("/:id", boxController.updateBox.bind(boxController));
router.delete("/:id", boxController.deleteBox.bind(boxController));

export default router;
