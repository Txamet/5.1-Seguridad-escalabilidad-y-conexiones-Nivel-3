import { prismaPostModel } from "../repositories/prisma-post-repository";
import { PostUseCase } from "../../application/use-cases/post-use-case";
import { v4 as uuid } from "uuid"

const postModel = new prismaPostModel();
const postUseCase = new PostUseCase(postModel);

export class PostController {
    static async createPost(req: any, res: any) {
        const { title, content } = req.body;
        const userId = req.user?.id;  
        if (!title || !content) return res.status(400).json({ error: "Invalid data format" });
         
        try {
            const post = await postUseCase.createPost({ id: uuid(), title, content, userId });
            res.status(200).json(post);

        } catch (error) {
            res.status(400).json({ error: "Error creating post" });
        }
    };

    static async updatePost(req: any, res: any) {
        const { title, content } = req.body;
        const postId = req.params.postId
        const userId = req.user?.id;

        if(!title || !content) return res.status(400).json({ error: "invalid data format" });

        const post = await postModel.findPostById(postId);
        if (!post) return res.status(404).json({ error: "Post doesn't exists" });
        if (post?.userId !== userId) return res.status(400).json({ error: "user isn't authorized to update this post" })

        try {
            const updatedPost = await postUseCase.updatePost(postId, { title, content, userId});
            res.status(200).json(updatedPost);

        } catch (error) {
            res.status(500).json({ error: "Error retrieving data" })
        }
    };

    static async deletePost(req: any, res: any) {
        const postId = req.params.postId;
        const userId = req.user?.id;

        const post = await postModel.findPostById(postId);
        if (!post) return res.status(404).json({ error: "Post doesn't exists" });
        if (post?.userId !== userId) return res.status(400).json({ error: "user isn't authorized to delete this post" });
        
        try {
            const deletedPost = await postUseCase.deletePost(postId);
            res.status(200).json("Post deleted");

        } catch (error) {
            res.status(500).json({ error: "Error retrieving data" })
        }
    };

    static async recoverPost(req: any, res: any) {
        const postId = req.params.postId;
        const userId = req.user?.id;

        const post = await postModel.findDeletedPostById(postId);
        if (!post) return res.status(404).json({ error: "Post doesn't exists" });
        if (post?.userId !== userId) return res.status(400).json({ error: "user isn't authorized to recover this post" });

        try {
            const recoveredPost = await postUseCase.recoverPost(postId);
            res.status(200).json("Post recovered");

        } catch (error) {
            res.status(500).json({ error: "Error retrieving data" })
        }
    };

    static async getPostsByUser(req: any, res: any) {
        const userId = req.user?.id;

        try {
            const posts = await postUseCase.getPostsByUser(userId);

            if (posts.length === 0) return res.status(200).json("User doesn't have any posts")

            res.status(200).json(posts);

        } catch (error) {
            res.status(500).json({ error: "Error retrieving data" })
        }
    };

    static async getDeletedPostsByUser(req: any, res: any) {
        const userId = req.user?.id;

        try {
            const posts = await postUseCase.getDeletedPostsByUser(userId);

            if (posts.length === 0) return res.status(200).json("User doesn't have any deleted posts")

            res.status(200).json(posts);

        } catch (error) {
            res.status(500).json({ error: "Error retrieving data" })
        }
    };

    static async getAllPosts(req: any, res: any) {
        try {
            const posts = await postUseCase.getAllPosts();

            if (posts.length === 0) return res.status(200).json("There aren't any posts")

            res.status(200).json(posts);

        } catch (error) {
            res.status(500).json({ error: "Error retrieving data" })
        }
    }

    static async getPost(req: any, res: any) {
        const postId = req.params.postId;

        try {
            const post = await postUseCase.getPost(postId);

            if (!post) return res.status(404).json({ error: "Post doesn't exists" });

            res.status(200).json(post);

        } catch (error) {
            res.status(500).json({ error: "Error retrieving data" })
        }
    }
}