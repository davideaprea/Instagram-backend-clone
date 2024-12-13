import { Reply } from "./reply.type";

export type ReplyDto = Pick<Reply, "content"> & {
    userId: string
    commentId: string
};