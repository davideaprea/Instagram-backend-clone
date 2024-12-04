import { deleteFile, PostTopics, saveFile } from "@ig-clone/common";
import { PostModel } from "../models/post.model";
import { PostRepository } from "../repositories/post.repository";
import { PostDto } from "../types/post-dto.type";
import { postProducer } from "../producers/post.producer";
import createHttpError from "http-errors";

export namespace PostService {
    export const create = async (dto: PostDto) => {
        const mediaUrls: string[] = await Promise.all(dto.medias.map(media => saveFile(media)));
        const { medias, ...post } = dto;

        await postProducer.sendMsg(PostTopics.POST_CREATE, dto.userId.toString());

        return await PostModel.create({
            ...post,
            medias: mediaUrls
        });
    }

    export const deletePost = async (id: string, userId: string) => {
        const post = await PostModel.findById(id);

        if(!post) {
            throw new createHttpError.NotFound("Post not found.");
        }

        await PostModel.deleteOne({ _id: id, userId });

        for(const media of post.medias) {
            await deleteFile(media);
        }

        await postProducer.sendMsg(PostTopics.POST_DELETE, id);
    }

    export const getPostPage = async (userId: string, limit: number = 10, lastPostId?: string) => {
        if (limit > 20 || limit <= 0) limit = 10;

        return await PostRepository.getPostPage(userId, limit, lastPostId);
    }
}