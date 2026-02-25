// backend/src/routes/userRoutes.ts
import express from "express";
import UserController from "../controllers/userController";
import { authMiddleware } from "../controllers/authMiddleware";
const router = express.Router();
const userController = new UserController();

router.post("/login/admin", userController.createUser.bind(userController));
router.get("/", userController.getUsers.bind(userController));
router.put("/:id", userController.updateUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));

router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));

router.get("/profile", authMiddleware, userController.getProfile.bind(userController));
router.put("/profile", authMiddleware, userController.updateProfile.bind(userController));


export default router;
