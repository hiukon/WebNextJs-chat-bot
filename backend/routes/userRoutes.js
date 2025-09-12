// backend/src/routes/userRoutes.ts
import express from "express";
import UserController from "../controllers/userController";
import authMiddleware from "../controllers/authMiddleware";

const router = express.Router();
const userController = new UserController();

// CRUD
router.post("/users/login/admin", userController.createUser.bind(userController));
router.get("/users", userController.getUsers.bind(userController));
router.put("/users/:id", userController.updateUser.bind(userController));
router.delete("/users/:id", userController.deleteUser.bind(userController));


router.post("/users/register", userController.register.bind(userController));
router.post("/users/login", userController.login.bind(userController));
// Protected route example
router.get("/profile", userController.getProfile.bind(userController));



export default router;
