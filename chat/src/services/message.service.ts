import { MessageDto } from "../types/message-dto.type";
import { Message } from "../types/message.type";
import { MessageModel } from "../models/message.model";
import { ChatService } from "./chat.service";

export namespace MessageService {
    export const create = async (message: MessageDto): Promise<Message> => {
        await ChatService.isUserInChat(message.chatId, message.senderId);

        return await MessageModel.create(message);
    }
}