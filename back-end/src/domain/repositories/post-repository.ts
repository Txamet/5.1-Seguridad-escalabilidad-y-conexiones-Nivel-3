import { PostEntity } from "../entities/post-entity";

export interface PostRepository {
    createPost(post: PostEntity): Promise<PostEntity | null>;
    updatePost(id: string, post: PostEntity): Promise<PostEntity | null>;
    deletePost(id: string): Promise<void>;
    hardDeletePost(id: string): Promise<void>;
    recoverPost(id: string): Promise<void>;
    getPostsByUser(id: string): Promise<PostEntity[]>;
    getDeletedPostsByUser(id: string): Promise<PostEntity[]>;
    getAllPosts(): Promise<PostEntity[]>;
    getPost(id: string): Promise<PostEntity | null>;
    likePost(userId: string, postId: string): Promise<void>;
    findPostById(id: string): Promise<PostEntity | null>;
    findDeletedPostById(id: string): Promise<PostEntity | null>;
    totalLikesByPost(id: string): Promise<number | null>;
    findLike(userId: string, postId: string): Promise <boolean | null>
}