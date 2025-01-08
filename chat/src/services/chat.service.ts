import createHttpError from "http-errors";
import { ChatModel } from "../models/chat.model";
import { ChatRepository } from "../repositories/chat.repository";
import { ChatType } from "../types/chat-type.enum";
import { Chat } from "../types/chat.type";

export namespace ChatService {
    export const create = async (chat: Chat): Promise<Chat> => {
        if (chat.type == ChatType.PRIVATE) {
            const privateChat = await ChatModel.findOne({ users: { $all: chat.users } });

            if (privateChat) return privateChat;
        }

        return await ChatModel.create(chat);
    }

    export const isUserInChat = async (chatId: string, userId: string): Promise<Chat> => {
        const chat = await ChatRepository.isUserInChat(chatId, userId);

        if(!chat) {
            throw new createHttpError.NotFound("Chat not found.");
        }

        return chat;
    }
}