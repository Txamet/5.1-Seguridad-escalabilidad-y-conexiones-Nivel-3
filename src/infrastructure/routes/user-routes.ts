import express from "express";
import { UserController } from "../controllers/user-controllers";
import { AuthMiddleware } from '../middlewares/auth-middleware';

const router = express.Router();

router.post("/register", UserController.createUser);

router.post("/login", UserController.loginUser)

router.put("/:userId", AuthMiddleware, UserController.updateUser);

router.delete("/:userId", AuthMiddleware, UserController.deleteUser);

router.patch("/:userId/recover", AuthMiddleware, UserController.recoverUser);

router.get("/", UserController.getUsers);

export default router