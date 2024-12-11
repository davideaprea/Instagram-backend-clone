import { Reply } from "./reply.type";

export type ReplyDto = Pick<Reply, "commentId" | "userId" | "content">;