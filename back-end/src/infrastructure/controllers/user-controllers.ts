import { prismaUserModel } from "../repositories/prisma-user-repository"
import { UserUseCase } from "../../application/use-cases/user-use-case";
import { v4 as uuid } from "uuid"

const userModel = new prismaUserModel();
const userUseCase = new UserUseCase(userModel)

export class UserController {
    static async createUser(req: any, res: any) {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(422).json({message: "Invalid data format"});
        }

        try {
            const findUserName = await userModel.findUserByName(name);
            if (findUserName) {
                return res.status(409).json({ message: "This name is already in use" })
            }

            const findUserEmail = await userModel.findUserByEmail(email);
            if (findUserEmail) {
                return res.status(409).json({ message: "This email is already in use" })
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
            return res.status(422).json({message: "Invalid data format"});
        }

        try {
            const findUser = await userModel.findUserById(req.params.userId);
            if (!findUser) {
                return res.status(404).json({ message: "User not found" })
            }

            const findUserName = await userModel.findUserByName(name);
            if (findUserName && findUser.name !== name) {
                return res.status(409).json({ message: "This name is already in use" })
            }

            const findUserEmail = await userModel.findUserByEmail(email);
            if (findUserEmail && findUser.email !== email) {
                return res.status(409).json({ message: "This email is already in use" })
            }

            const updatedUser = await userUseCase.updateUser(req.params.userId, { name, email, password });
            res.status(200).json(updatedUser)

        } catch (error) {
            res.status(500).json({ message: "Error retrieving user" })
        }
    };

    static async setAdmin(req: any, res: any) {
        try {
            const findUser = await userModel.findUserById(req.params.userId);
            if (findUser === null) {
                return res.status(404).json({ message: "User not found" })
            }

            await userUseCase.setAdmin(req.params.userId);
            res.status(200).json({ message: "User role is upgraded to administrator" })
            
        } catch (error) {
            res.status(500).json({ message: "Error retrieving user" })
        }
    }

    static async deleteUser(req: any, res: any) {
        try {
            const findUser = await userModel.findUserById(req.params.userId);
            if (findUser === null) {
                return res.status(404).json({ message: "User not found" })
                
            } else if (findUser.role === "admin") {
                return res.status(401).json({ message: "User isn't authorized to delete this user"})
            }
    
            await userUseCase.deleteUser(req.params.userId);
            res.status(200).json({ message: "User banned"})
    
    
        } catch (error) {
            res.status(500).json({ message: "Error retrieving user" })
        }
    }

    static async recoverUser(req: any, res: any) {
        try {
            const searchUserById = await userModel.findDeletedUserById(req.params.userId);
            if (!searchUserById) return res.status(404).json({ message: "User not found" });
    
            const searchUserByEmail = await userModel.findUserByEmail(searchUserById.email);
            if (searchUserByEmail) return res.status(409).json({message: "User already exists with another userId"});
        
            await userUseCase.recoverUser(req.params.userId);
            res.status(200).json({message: "User unbanned"}); 
    
        } catch (error) {
            res.status(500).json({message: "Error retrieving user"});
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
            res.status(500).json({ message: "Error retrieving user" })
        }
    }

    static async getOneUser(req: any, res: any) {
        try {
            const user: any = await userModel.findUserById(req.params.userId);
            const { password: _, ...publicUser } = user;

            res.status(200).json(publicUser)
            
        } catch (error) {
            res.status(500).json({ message: "Error retrieving user" })
        }
    }

    static async loginUser(req: any, res: any) {
        const { email, password } = req.body; 

        if (!email || !password) return res.status(422).json({message: "Invalid format data"});

        try {
            const user = await userModel.findUserByEmail(email);
            if (!user) return res.status(404).json({message: "User not found"})

            const name = user.name; 
            const role = user.role;   
            const id = user.id;

            const token = await userUseCase.loginUser(email, password);

            if (token === "Invalid credentials")  {
                res.status(401).json({message: token})

            } else {
                res.status(200).json({id, name, email, role, token})
            }

        } catch (error: any) {
            res.status(500).json({ message: "Error retrieving user" })
        }
    }
}