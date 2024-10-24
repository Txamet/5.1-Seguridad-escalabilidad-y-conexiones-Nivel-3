import { PrismaClient } from '@prisma/client';
import { PostEntity } from '../../domain/entities/post-entity';
import { PostRepository } from "../../domain/repositories/post-repository";
import { PostValue } from "../../domain/values/post-value";

const prisma = new PrismaClient();

export class prismaPostModel implements PostRepository {

    async createPost(post: PostEntity): Promise<PostEntity | null> {
        const createdPost = await prisma.post.create({
            data: {
                title: post.title,
                content: post.content,
                userId: post.userId
            }
        })

        const result = new PostValue(createdPost.id, createdPost.title, createdPost.content, createdPost.userId);
        return result;
    }

    async updatePost(id: string, post: PostEntity): Promise<PostEntity | null> {
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title: post.title,
                content: post.content,
                userId: post.userId
            }
        })

        const result = new PostValue(updatedPost.id, updatedPost.title, updatedPost.content, updatedPost.userId);
        return result;
    }

    async deletePost(id: string): Promise<void> {
        const deletedPost = await prisma.post.update({
            where: { id },
            data: { deleted: true }
        })
    }

    async recoverPost(id: string): Promise<void> {
        const recoveredPost = await prisma.post.update({
            where: { id },
            data: { deleted: false }
        })
    }

    async getPostsByUser(userId: string): Promise<PostEntity[]> {
        const result = await prisma.post.findMany({
            where: { userId: userId, deleted: false }
        })

        return result;
    }

    async getDeletedPostsByUser(userId: string): Promise<PostEntity[]> {
        const result = await prisma.post.findMany({
            where: { userId: userId, deleted: true }
        })

        return result;
    }

    async getAllPosts(): Promise<PostEntity[]> {
        const result = await prisma.post.findMany({
            where: { deleted: false }
        });
        return result;
    }

    async findPostById(id: string): Promise<PostEntity | null> {
        const post = await prisma.post.findFirst({
            where: { id: id, deleted: false }
        })

        if (!post) return null

        const result = new PostValue(post.id, post.title, post.content, post.userId);
        return result
    }

    async findDeletedPostById(id: string): Promise<PostEntity | null> {
        const post = await prisma.post.findFirst({
            where: { id: id, deleted: true }
        })

        if (!post) return null
        
        const result = new PostValue(post.id, post.title, post.content, post.userId);
        return result
    }
}