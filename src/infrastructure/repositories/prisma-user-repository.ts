import { PrismaClient } from '@prisma/client';
import { UserEntity } from '../../domain/entities/user-entity';
import { UserValue } from '../../domain/values/user-value';
import { UserRepository } from "../../domain/repositories/user-repository";
import { HashService } from '../../application/services/hash-service';

const prisma = new PrismaClient();

export class prismaUserModel implements UserRepository {

    async getFirstInList(limit: number) {
        const user = await prisma.user.findMany({
            take: limit
        })
        return user
    }

    async findUserById(id: string): Promise<UserEntity | null> {
        const user = await prisma.user.findFirst({
            where: {id: id, deleted: false}
        });

        if (!user) return null

        const result = new UserValue(user.name, user.email, user.password);
        return result
    }

    async findDeletedUserById(id: string): Promise<UserEntity | null> {
        const user = await prisma.user.findFirst({
            where: { id, deleted: true }
        })

        if (!user) return null

        const result = new UserValue(user.name, user.email, user.password);
        return result
    }

    async findUserByEmail(email: string): Promise<UserEntity | null> {
        const user = await prisma.user.findFirst({
            where: { email, deleted: false }
        })

        if (!user) return null

        const result = new UserValue(user.name, user.email, user.password);
        return result
    }


    async getUsers(): Promise<UserEntity[]> {
        const result =  await prisma.user.findMany();
        return result;
    };

    async registerAdmin(user: UserEntity): Promise<UserEntity | null> {
        let passwordHash = await HashService.hashPassword(user.email)
        const createdAdmin = await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: passwordHash,
                role: "admin"
            }
        });

        const result = new UserValue(createdAdmin.name, createdAdmin.email, createdAdmin.password);
        return result
    }

    async registerUser(user: UserEntity): Promise<UserEntity | null> {
        let passwordHash = await HashService.hashPassword(user.email)
        const createdUser = await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: passwordHash,
                role: "simpleUser"
            }
        });

        const result = new UserValue(createdUser.name, createdUser.email, createdUser.password);
        return result
    }

    async deleteUser(id: string): Promise<void> {
        const deletedUser = await prisma.user.update({
            where: { id },
            data: { deleted: true }
        })
    } 

    async updateUser(id: string, user: UserEntity): Promise<UserEntity | null> {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name: user.name,
                email: user.email,
                password: user.password
            }
        })

        const result = new UserValue(updatedUser.name, updatedUser.email, updatedUser.password);
        return result
    }

    async recoverUser(id: string): Promise<void> {
        const recoveredUser = await prisma.user.update({
            where: { id },
            data: { deleted: false }
        })
    }
}