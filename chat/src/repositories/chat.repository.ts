import { ChatModel } from "../models/chat.model";
import { Chat } from "../types/chat.type";

export namespace ChatRepository {
    export const isUserInChat = async (chatId: string, userId: string): Promise<Chat | null> => {
        return await ChatModel.findOne(
            {
                _id: chatId,
                users: { $in: [userId] }
            }
        );
    }
}