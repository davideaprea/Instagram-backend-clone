import { PostRepository } from "../repositories/post.repository";

export namespace PostService {
    export const getPostPage = async (userId: string, limit: number = 10, lastPostId?: string) => {
        if (limit > 20 || limit <= 0) limit = 10;

        return await PostRepository.getPostPage(userId, limit, lastPostId);
    }
}