import { UserEntity } from "../entities/user-entity";

export interface UserRepository {
    findUserById(id: string): Promise<UserEntity | null>;
    findUserByEmail(email: string): Promise<UserEntity | null>;
    findDeletedUserById(id: string): Promise<UserEntity | null>;
    registerAdmin(user: UserEntity): Promise<UserEntity | null>;
    registerUser(user: UserEntity): Promise<UserEntity | null>;
    updateUser(id: string, user: UserEntity): Promise<UserEntity | null>;
    deleteUser(id: string): Promise<void>;
    recoverUser(id: string): Promise<void>;
    getUsers(): Promise<UserEntity[]>;
    getFirstInList(limit: number): Promise<UserEntity[]>;
}