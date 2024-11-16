import express  from "express";
import { PostController } from "../controllers/post-controllers";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { authorizeAdmin } from "../middlewares/admin-middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id: 
 *           type: string
 *           description: auto-generated id of the post
 *         title:
 *           type: string
 *           description: the title of the post
 *         content:
 *           type: string
 *           description: the content of the post
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: the datetime when the post was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: the datetime of the post last update
 *         deleted:
 *           type: boolean
 *           description: determines if the post is soft deleted (true), sets "false" as default               
 *         userId: 
 *           type: string
 *           description: the id of the user that created the post
 *       required:
 *         - title
 *         - content 
 *     ReturnedPost:
 *       type: object
 *       properties:
 *         author:
 *           type: string
 *           description: the author of the post
 *         popularity:
 *           type: string
 *           description: the popularity of the post
 *         data:
 *           type: object
 *           properties:        
 *             id: 
 *               type: string
 *               description: auto-generated id of the post
 *             title:
 *               type: string
 *               description: the title of the post
 *             content:
 *               type: string
 *               description: the content of the post
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: the datetime when the post was created
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: the datetime of the post last update
 *             deleted:
 *               type: boolean
 *               description: determines if the post is soft deleted (true), sets "false" as default               
 *             userId: 
 *               type: string
 *               description: the id of the user that created the post
 *       required:
 *         - author
 *         - popularity
 *         - data        
 *     EmptyList:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: a message for response 204 empty content
 *       example:
 *         message: The posts list is empty
 *     UserNotAuthorized:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: a message for error 401 user not authorized
 *       example:
 *         message: User isn't authorized to update this post
 *     PostNotFound:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: a message for error 404 post not found
 *       example:
 *         message: Post doesn't exists   
 *     PostReallyLiked:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: a message for error 409 post already liked
 *       example:
 *         message: User already liked this post once  
 *     InvalidFormat:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: a message for error 422 invalid data format
 *       example:
 *         message: Invalid data format
 *     ErrorOnDatabase:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: a messsage for error 500 retrieving post data from database
 *       example:
 *         message: Error retrieving data            
 *   parameters:
 *     postId:
 *       in: path
 *       name: postId
 *       required: true
 *       schema:
 *         type: string
 *       description: The post id
 *   securitySchemes:
 *     Token:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT     
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Posts endpoints
 */


/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a post
 *     tags: [Posts]
 *     security:
 *       - Token: []  
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Post"
 *     responses:
 *       200: 
 *         description: Post succesfully created 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post" 
 *       422:
 *         description: Invalid input data format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InvalidFormat"
 *       500:
 *         description: Error creating post data to database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"        
 */

router.post("/create", AuthMiddleware , PostController.createPost);


/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - Token: []
 *     parameters:
 *       - $ref: "#/components/parameters/postId"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Post"
 *     responses:
 *       200: 
 *         description: Post succesfully updated 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post" 
 *       401: 
 *         description: User not authorized 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserNotAuthorized" 
 *       404: 
 *         description: Post not found 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PostNotFound" 
 *       422:
 *         description: Invalid input data format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InvalidFormat"
 *       500:
 *         description: Error retrieving post data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"               
 */

router.put("/:postId", AuthMiddleware, PostController.updatePost);


/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Soft delete a post
 *     tags: [Posts]
 *     security:
 *       - Token: []
 *     parameters:
 *       - $ref: "#/components/parameters/postId"
 *     responses:
 *       200:
 *         description: Post succesfully soft deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   description: post soft deleted
 *               example:
 *                 success: Post deleted 
 *       401: 
 *         description: User not authorized 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserNotAuthorized" 
 *       404: 
 *         description: Post not found 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PostNotFound" 
 *       500:
 *         description: Error retrieving post data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"                 
 */

router.delete("/:postId", AuthMiddleware, PostController.deletePost);


/**
 * @swagger
 * /posts/{postId}/recover:
 *   patch:
 *     summary: Recover a deleted post
 *     tags: [Posts]
 *     security:
 *       - Token: []
 *     parameters:
 *       - $ref: "#/components/parameters/postId"
 *     responses:
 *       200:
 *         description: Post succesfully recovered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   description: post recovered from soft delete
 *               example:
 *                 success: Post recovered 
 *       401: 
 *         description: User not authorized 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserNotAuthorized" 
 *       404: 
 *         description: Post not found 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PostNotFound" 
 *       500:
 *         description: Error retrieving post data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"
 */

router.patch("/:postId/recover", AuthMiddleware, PostController.recoverPost);


/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all non-deleted posts
 *     tags: [Posts]
 *     security: 
 *       - Token: []
 *     responses:
 *       200:
 *         description: List of all non-deleted posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ReturnedPost"  
 *       204:
 *         description: The posts list is empty
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EmptyList"
 *       500:
 *         description: Error retrieving post data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"                              
 */

router.get("/", AuthMiddleware, PostController.getAllPosts);


/**
 * @swagger
 * /posts/users/{userId}:
 *   get:
 *     summary: Get all non-deleted posts for an user
 *     tags: [Posts]
 *     security: 
 *       - Token: []
 *     parameters:
 *       - $ref: "#/components/parameters/userId" 
 *     responses:
 *       200:
 *         description: List of all non-deleted posts by an user id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ReturnedPost"  
 *       204:
 *         description: The user posts list is empty
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EmptyList"
 *       500:
 *         description: Error retrieving post data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"
 */

router.get("/users/:userId", AuthMiddleware, PostController.getPostsByUser);


/**
 * @swagger
 * /posts/users/{userId}/deleted:
 *   get:
 *     summary: Get all deleted posts for an user
 *     tags: [Posts]
 *     security: 
 *       - Token: []
 *     parameters:
 *       - $ref: "#/components/parameters/userId" 
 *     responses:
 *       200:
 *         description: List of all deleted posts by an user id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ReturnedPost"  
 *       204:
 *         description: The user deleted posts list is empty
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EmptyList"
 *       500:
 *         description: Error retrieving post data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"
 */

router.get("/users/:userId/deleted", AuthMiddleware, PostController.getDeletedPostsByUser);


/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Get a post
 *     tags: [Posts]
 *     security: 
 *       - Token: []
 *     parameters:
 *       - $ref: "#/components/parameters/postId" 
 *     responses:
 *       200:
 *         description: Get a post by post id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ReturnedPost"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PostNotFound" 
 *       500:
 *         description: Error retrieving post data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"
 */

router.get("/:postId", AuthMiddleware, PostController.getPost);


/**
 * @swagger
 * /posts/{postId}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Posts]
 *     security: 
 *       - Token: []
 *     parameters:
 *       - $ref: "#/components/parameters/postId" 
 *     responses:
 *       200:
 *         description: Post liked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   description: post liked
 *               example:
 *                 success: Post liked  
 *       401:
 *         description: User isn't authorized to like the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserNotAuthorized" 
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PostNotFound" 
 *       409:
 *         description: Post already liked by the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PostReallyLiked" 
 *       500:
 *         description: Error retrieving post data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"
 */

router.post("/:postId/like", AuthMiddleware, PostController.likePost);

export default router