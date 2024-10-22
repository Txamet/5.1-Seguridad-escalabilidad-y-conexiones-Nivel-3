import { PostRepository } from "../../domain/repositories/post-repository";
import { PostValue } from "../../domain/values/post-value";

export class PostUseCase {
    constructor( private readonly postRepository: PostRepository) {

    }

    async createPost({title, content}: {title: string, content: string}) {
        const postValue = new PostValue(title, content)
    }
}