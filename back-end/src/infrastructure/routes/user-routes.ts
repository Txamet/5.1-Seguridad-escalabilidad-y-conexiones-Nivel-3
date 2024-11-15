import express from "express";
import { UserController } from "../controllers/user-controllers";
import { AuthMiddleware } from '../middlewares/auth-middleware';
import { authorizeAdmin } from "../middlewares/admin-middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: auto-generated id of the user 
 *         name: 
 *           type: string
 *           description: the name of the user  
 *         email:
 *           type: string
 *           description: the email of the user
 *         password:
 *           type: string
 *           description: the password of the user
 *         role:
 *           type: string
 *           description: the role of the user, sets "simpleUser" as default except from the first user created which role is "admin"
 *         deleted:
 *           type: boolean
 *           description: determines if the user is banned (true), sets "false" as default 
 *       required:   
 *         - name
 *         - email
 *         - password
 *     UserNotFound:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: a message for error 404 user not found
 *       example:
 *         error: User doesn't exists
 *     ErrorOnDatabase:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: a messsage for error 500 retrieving user data from database
 *       example:
 *         error: Error retrieving data   
 *     UserAlreadyExists:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: a message for error 409 user already exists
 *       example:
 *         error: User already exists with another userId 
 *     InvalidFormat:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: a message for error 422 invalid data format
 *       example:
 *         error: Invalid data format                       
 *   parameters:
 *     userId:
 *       in: path
 *       name: userId
 *       required: true
 *       schema:
 *         type: string
 *       description: The user id
 *   securitySchemes:
 *     Token: 
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT    
 */   

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User endpoints
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register an user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *     responses:
 *       200:
 *         description: User succesfully registered 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User" 
 *       409:
 *         description: User already exists in database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserAlreadyExists"
 *       422:
 *         description: Invalid input data format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InvalidFormat"
 *       500:
 *         description: Error retrieving user data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"                            
 */

router.post("/register", UserController.createUser);


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in an user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:  
 *             $ref: "#/components/schemas/User"
 *     responses:
 *       200:
 *         description: User succesfully logged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: the id of the logged user
 *                 name:
 *                   type: string
 *                   description: the name of the logged user    
 *                 email:
 *                   type: string
 *                   description: the email of the logged user
 *                 role:
 *                   type: string
 *                   description: the role of the logged user  
 *                 token:
 *                   type: string
 *                   description: auto-generated token to authenticate the user
 *       500:
 *         description: Error retrieving user data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"                       
 */

router.post("/login", UserController.loginUser);


/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update an user
 *     tags: [Users]
 *     security:
 *       - Token: []  
 *     parameters:
 *       - $ref: "#/components/parameters/userId"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *     responses:
 *       200:   
 *         description: User succesfully updated  
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       404:
 *         description: User not found  
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserNotFound"
 *       409:
 *         description: User already exists in database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserAlreadyExists"
 *       422:
 *         description: Invalid input data format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InvalidFormat"
 *       500:
 *         description: Error retrieving user data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"   
 */

router.put("/:userId", AuthMiddleware, UserController.updateUser);


/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Soft delete an user
 *     tags: [Users] 
 *     security:
 *       - Token: []
 *     parameters:
 *       - $ref: "#/components/parameters/userId"
 *     responses:
 *       200:
 *         description: User succesfully soft deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   description: user soft deleted
 *               example:
 *                 success: User deleted 
 *       404: 
 *         description: User not found  
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserNotFound"
 *       500:
 *         description: Error retrieving user data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"          
 */

router.delete("/:userId", AuthMiddleware, authorizeAdmin, UserController.deleteUser);


/**
 * @swagger
 * /users/{userId}/recover:
 *   patch:
 *     summary: Recover a soft-deleted user
 *     tags: [Users] 
 *     security:
 *       - Token: []
 *     parameters:
 *       - $ref: "#/components/parameters/userId"
 *     responses:
 *       200:
 *         description: User succesfully recovered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   description: user recovered from soft delete
 *               example:
 *                 success: User recovered 
 *       404: 
 *         description: User not found  
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserNotFound"
 *       409:
 *         description: User already exists in database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserAlreadyExists"
 *       500:
 *         description: Error retrieving user data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"       
 */

router.patch("/:userId/recover", AuthMiddleware, authorizeAdmin, UserController.recoverUser);


/**
 * @swagger
 * /users:
 *  get:
 *    summary: Get all users
 *    tags: [Users]
 *    security:
 *      - Token: []      
 *    responses:
 *      200: 
 *        description: List of all users  
 *        content:
 *          application/json:  
 *            schema:
 *              type: array   
 *              items:
 *                $ref: "#/components/schemas/User"
 *      500:
 *         description: Error retrieving user data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"   
 */

router.get("/", AuthMiddleware, authorizeAdmin, UserController.getUsers);


/**
 * @swagger
 * /users/{userId}:
 *  get:
 *    summary: Get one user
 *    tags: [Users]
 *    security:
 *      - Token: [] 
 *    parameters:
 *       - $ref: "#/components/parameters/userId"       
 *    responses:
 *      200: 
 *        description: Show an user data by id  
 *        content:
 *          application/json:  
 *            schema:
 *              $ref: "#/components/schemas/User"
 *      500:
 *         description: Error retrieving user data from database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorOnDatabase"   
 */

router.get("/:userId", AuthMiddleware, UserController.getOneUser)

export default router;