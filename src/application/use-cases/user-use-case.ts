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

    async registerUser({name, email, password}: {name: string, email: string, password: string}) {
        let passwordHash = await HashService.hashPassword(password); 
        const userValue = new UserValue(name, email, passwordHash);
       
        const user = await this.userRepository.registerUser(userValue);

        const { password: _, deleted: __, ...publicUser } = userValue;
        return user;
    }

    async registerAdmin({name, email, password}: {name: string, email: string, password: string}) {
        let passwordHash = await HashService.hashPassword(password);
        const userValue = new UserValue(name, email, passwordHash);

        const user = await this.userRepository.registerAdmin(userValue);

        const { password: _, deleted: __, ...publicUser } = userValue;
        return user;
    }

    async updateUser(id: string, {name, email, password}: {name: string, email: string, password: string}) {
        const userValue = new UserValue(name, email, password);
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
            return AuthService.generateToken(user.id);
        }  
    }
}