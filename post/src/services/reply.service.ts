import { transactionHandler } from "@ig-clone/common"
import { ReplyModel } from "../models/reply.model";
import { CommentModel } from "../models/comment.model";
import { ReplyDto } from "../types/reply-dto.type";
import createHttpError from "http-errors";
import { PostModel } from "../models/post.model";

export namespace ReplyService {
    export const create = transactionHandler(async (session, dto: ReplyDto) => {
        const comment = await CommentModel.findOneAndUpdate(
            { _id: dto.commentId },
            { $inc: { replies: 1 } },
            { session }
        );

        if (!comment) {
            throw new createHttpError.NotFound("Comment not found.");
        }

        await PostModel.updateOne(
            { _id: comment.postId },
            { $inc: { comments: 1 } },
            { session }
        );

        return (await ReplyModel.create([dto], { session }))[0];
    });

    export const remove = transactionHandler(async (session, id: string, userId: string) => {
        const deletedReply = await ReplyModel.findOneAndDelete({ _id: id, userId }, { session });

        if (!deletedReply) {
            throw new createHttpError.NotFound("Reply not found.");
        }

        const comment = await CommentModel.findOneAndUpdate(
            { _id: deletedReply.commentId },
            { $inc: { replies: -1 } },
            { session }
        );

        if (!comment) {
            throw new createHttpError.NotFound("Parent comment not found.");
        }

        await PostModel.updateOne(
            { _id: comment.postId },
            { $inc: { comments: -1 } },
            { session }
        );
    });
}