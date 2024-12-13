import { Comment } from "./comment.type";

export type CommentDto = Pick<Comment, "content"> & {
    postId: string
    userId: string
};