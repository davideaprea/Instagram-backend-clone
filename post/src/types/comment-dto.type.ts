import { Comment } from "./comment.type";

export type CommentDto = Pick<Comment, "content" | "postId" | "userId">;