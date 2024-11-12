import { prismaUserModel } from "../repositories/prisma-user-repository"
import { UserUseCase } from "../../application/use-cases/user-use-case";
import { v4 as uuid } from "uuid"

const userModel = new prismaUserModel();
const userUseCase = new UserUseCase(userModel)

export class UserController {
    static async createUser(req: any, res: any) {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(422).json({error: "Invalid data format"});
        }

        try {
            const findUser = await userModel.findUserByEmail(email);
            if (findUser) {
                return res.status(409).json({ error: "User already exists" })
            }

            const totalUsers = await userUseCase.getFirstInList(1);
            if (totalUsers.length === 0 || totalUsers === null || totalUsers === undefined) {
                const newAdmin = await userUseCase.registerAdmin({ id: uuid(), name, email, password });
                res.status(200).json(newAdmin)

            } else {
                const newUser = await userUseCase.registerUser(req.body);
                res.status(200).json(newUser)
            }


        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" })
        }
    };

    static async updateUser(req: any, res: any) {
        const { name, email, password } = req.body;
        if(!name || !email) {
            return res.status(422).json({error: "Invalid data format"});
        }

        try {
            const findUser = await userModel.findUserById(req.params.userId);
            if (!findUser) {
                return res.status(404).json({ error: "User not found" })
            }

            const updatedUser = await userUseCase.updateUser(req.params.userId, { name, email, password });
            res.status(200).json(updatedUser)

        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" })
        }
    };

    static async deleteUser(req: any, res: any) {
        try {
            const findUser = await userModel.findUserById(req.params.userId);
            console.log(findUser)
            if (findUser === null) {
                return res.status(404).json({ error: "User not found" })
            }
    
            await userUseCase.deleteUser(req.params.userId);
            res.status(200).json("User deleted")
    
    
        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" })
        }
    }

    static async recoverUser(req: any, res: any) {
        try {
            const searchUserById = await userModel.findDeletedUserById(req.params.userId);
            if (!searchUserById) return res.status(404).json({error: "User not found"});
    
            const searchUserByEmail = await userModel.findUserByEmail(searchUserById.email);
            if (searchUserByEmail) return res.status(409).json({error: "User already exists with another userId"});
        
            await userUseCase.recoverUser(req.params.userId);
            res.status(200).json({success: "User recovered"}); 
    
        } catch (error) {
            res.status(500).json({error: "Error retrieving user"});
        }
    }

    static async getUsers(req: any, res: any) {
        try {
            const showUsers = await userUseCase.getUsers();
    
            if (showUsers.length === 0) {
                res.status(200).json("User's list is empty");  
    
            } else {
                res.status(200).json(showUsers);     
            }
        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" })
        }
    }

    static async getOneUser(req: any, res: any) {
        try {
            const user = await userModel.findUserById(req.params.userId);
            res.status(200).json(user)
            
        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" })
        }
    }

    static async loginUser(req: any, res: any) {
        const { email, password } = req.body; 

        if (!email || !password) return res.status(422).json({error: "Invalid format data"});

        try {
            const user = await userModel.findUserByEmail(email);
            if (!user) return res.status(404).json({error: "User not found"})

            const name = user.name; 
            const role = user.role;   
            const id = user.id;

            const token = await userUseCase.loginUser(email, password);

            if (token === "Invalid credentials")  {
                res.status(401).json({error: token})

            } else {
                res.status(200).json({id, name, email, role, token})
            }

        } catch (error: any) {
            res.status(500).json({ error: "Error retrieving user" })
        }
    }
}