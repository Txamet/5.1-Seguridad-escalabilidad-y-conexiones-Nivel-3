import express  from "express";
import { PostController } from "../controllers/post-controllers";
import { AuthMiddleware } from "../middlewares/auth-middleware";

const router = express.Router();

router.post("/create-post", AuthMiddleware , PostController.createPost)



export default router