import express  from "express";
import { PostController } from "../controllers/post-controllers";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { authorizeAdmin } from "../middlewares/admin-middleware";

const router = express.Router();

router.post("/create", AuthMiddleware , PostController.createPost);

router.put("/:postId", AuthMiddleware, PostController.updatePost);

router.delete("/:postId", AuthMiddleware, PostController.deletePost);

router.patch("/:postId/recover", AuthMiddleware, PostController.recoverPost);

router.get("/", AuthMiddleware, PostController.getAllPosts);

router.get("/users/:userId", AuthMiddleware, PostController.getPostsByUser);

router.get("/users/:userId/deleted", AuthMiddleware, PostController.getDeletedPostsByUser);

router.get("/:postId", AuthMiddleware, PostController.getPost);

router.post("/:postId/like", AuthMiddleware, PostController.likePost);

//router.get("/:postId/popularity", AuthMiddleware, PostController.postPopularity);

export default router