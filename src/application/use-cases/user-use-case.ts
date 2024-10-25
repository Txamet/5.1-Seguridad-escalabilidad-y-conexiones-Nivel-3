import { UserRepository } from "../../domain/repositories/user-repository";
import { UserValue } from "../../domain/values/user-value";
import { AuthService } from "../services/auth-service";
import { HashService } from '../services/hash-service';


export class UserUseCase {
    constructor(private readonly userRepository: UserRepository){

    }

    async getFirstInList(limit: number) {
        const user = await this.userRepository.getFirstInList(limit)
        return user
    }

    async registerUser({id, name, email, password}: {id: string, name: string, email: string, password: string}) {
        let passwordHash = await HashService.hashPassword(password); 
        const userValue = new UserValue(id, name, email, passwordHash, "simpleUser");
       
        const user = await this.userRepository.registerUser(userValue);

        const { password: _, deleted: __, ...publicUser } = userValue;
        return user;
    }

    async registerAdmin({id, name, email, password}: {id: string, name: string, email: string, password: string}) {
        let passwordHash = await HashService.hashPassword(password);
        const userValue = new UserValue(id, name, email, passwordHash, "admin");

        const user = await this.userRepository.registerAdmin(userValue);

        const { password: _, deleted: __, ...publicUser } = userValue;
        return user;
    }

    async updateUser(id: string, data: any) {
        let userValue;
        
        if (data.password) {
            let passwordHash = await HashService.hashPassword(data.password);
            userValue = new UserValue(id, data.name, data.email, passwordHash, data.role);

        } else {
            userValue = new UserValue(id, data.name, data.email, data.password, data.role);
        }

        const user = await this.userRepository.updateUser(id, userValue);
        
        return user;
    }

    async deleteUser(id: string) {
        await this.userRepository.deleteUser(id);
    }

    async recoverUser(id: string) {
        await this.userRepository.recoverUser(id);
    }

    async getUsers() {
        const users = await this.userRepository.getUsers();

        return users;
    }

    async loginUser(email: string, password: string) {
        const user: any = await this.userRepository.findUserByEmail(email);
        if (!user) throw new Error("User doesn't exists");
        
        const comparePassword = await HashService.comparePassword(password, user.password)

        if (!comparePassword) {
            throw new Error("Credentials are invalid");

        } else {
            return AuthService.generateToken(user.id, user.role);
        }  
    }
}