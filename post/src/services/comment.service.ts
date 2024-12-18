import { getPage, transactionHandler } from "@ig-clone/common";
import { CommentDto } from "../types/comment-dto.type";
import { CommentModel } from "../models/comment.model";
import { PostModel } from "../models/post.model";
import createHttpError from "http-errors";
import { ReplyModel } from "../models/reply.model";

export namespace CommentService {
    export const create = transactionHandler(async (session, dto: CommentDto) => {
        await PostModel.updateOne(
            { _id: dto.postId },
            { $inc: { comments: 1 } },
            { session }
        );
        return (await CommentModel.create([dto], { session }))[0];
    });

    export const remove = transactionHandler(async (session, id: string, userId: string) => {
        const deletedComment = await CommentModel.findOneAndDelete({ _id: id, userId }, { session });

        if (!deletedComment) {
            throw new createHttpError.NotFound("Comment not found.");
        }

        const replyDeleteRes = await ReplyModel.deleteMany({ commentId: id }, { session });

        await PostModel.updateOne(
            { _id: deletedComment.postId },
            { $inc: { comments: -(replyDeleteRes.deletedCount + 1) } },
            { session }
        );
    });
}