import { PostRepository } from "../../domain/repositories/post-repository";
import { PostValue } from "../../domain/values/post-value";

export class PostUseCase {
    constructor( private readonly postRepository: PostRepository) {

    }

    async createPost({id, title, content, userId}: {id: string, title: string, content: string, userId: string}) {
        const postValue = new PostValue(id, title, content, userId);
        const post = await this.postRepository.createPost(postValue);

        return post;
    }

    async updatePost(id: string, {title, content, userId}: {title: string, content: string, userId: string}) {
        const postValue = new PostValue(id, title, content, userId);
        const post = await this.postRepository.updatePost(id, postValue);

        return post;
    }

    async deletePost(id: string) {
        await this.postRepository.deletePost(id);
    }    

    async recoverPost(id: string) {
        await this.postRepository.recoverPost(id);
    }

    async getPostsByUser(id: string) {
        const posts = await this.postRepository.getPostsByUser(id);

        return posts;
    }

    async getDeletedPostsByUser(id: string) {
        const posts = await this.postRepository.getDeletedPostsByUser(id);

        return posts;
    }

    async getAllPosts() {
        const posts = await this.postRepository.getAllPosts();

        return posts;
    }


}