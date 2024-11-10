import express from "express";
import { UserController } from "../controllers/user-controllers";
import { AuthMiddleware } from '../middlewares/auth-middleware';
import { authorizeAdmin } from "../middlewares/admin-middleware";

const router = express.Router();

router.post("/register", UserController.createUser);

router.post("/login", UserController.loginUser);

router.put("/:userId", AuthMiddleware, UserController.updateUser);

router.delete("/:userId", AuthMiddleware, authorizeAdmin, UserController.deleteUser);

router.patch("/:userId/recover", AuthMiddleware, authorizeAdmin, UserController.recoverUser);

router.get("/", AuthMiddleware, authorizeAdmin, UserController.getUsers);

router.get("/:userId", AuthMiddleware, UserController.getOneUser)

export default router;