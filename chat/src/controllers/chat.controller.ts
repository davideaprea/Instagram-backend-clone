import { RequestHandler } from "express";
import { ChatService } from "../services/chat.service";

export namespace ChatController {
    export const create: RequestHandler = async (req, res) => {
        const chat = ChatService.create(req.body);

        res
            .status(200)
            .json(chat);
    }
}