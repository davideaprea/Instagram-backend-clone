import { transactionHandler } from "@ig-clone/common"
import { ReplyModel } from "../models/reply.model";
import { CommentModel } from "../models/comment.model";
import { ReplyDto } from "../types/reply-dto.type";
import createHttpError from "http-errors";
import { PostModel } from "../models/post.model";

export namespace ReplyService {
    export const create = async (dto: ReplyDto) => {
        await transactionHandler(async session => {
            const comment = await CommentModel.findOneAndUpdate(
                { _id: dto.commentId },
                { replies: { $inc: 1 } },
                { session }
            );

            if (!comment) {
                throw new createHttpError.NotFound("Comment not found.");
            }

            await PostModel.updateOne(
                { _id: comment.postId },
                { comments: { $inc: 1 } },
                { session }
            );

            await ReplyModel.create([dto], { session });
        });
    }

    export const remove = async (id: string, userId: string) => {
        await transactionHandler(async session => {
            const deletedReply = await ReplyModel.findOneAndDelete({ _id: id, userId }, { session });

            if (!deletedReply) {
                throw new createHttpError.NotFound("Reply not found.");
            }

            await PostModel.updateOne(
                { _id: deletedReply._id },
                { $inc: { comments: -1 } },
                { session }
            );
        });
    }
}