import { prismaPostModel } from "../repositories/prisma-post-repository";
import { PostUseCase } from "../../application/use-cases/post-use-case";
import { v4 as uuid } from "uuid"

const postModel = new prismaPostModel();
const postUseCase = new PostUseCase(postModel);

export class PostController {
    static async createPost(req: any, res: any) {
        const { title, content } = req.body;
        const userId = req.user?.id;
        console.log(userId, req.user?.id)
        if (!title || !content) return res.status(400).json({ error: "Invalid data format" })

        try {
            const post = await postUseCase.createPost({ id: uuid(), title, content, userId });
            res.status(200).json(post);

        } catch (error) {
            res.status(400).json({ error: "Error creating post" });
        }
    }
}