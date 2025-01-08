import { createServer } from "http";
import { JwtPayload, verify } from "jsonwebtoken";
import { Server } from "socket.io";
import { app } from "..";
import createHttpError from "http-errors";
import { UserModel } from "../models/user.model";
import { ChatService } from "../services/chat.service";
import { MessageDto } from "../types/message-dto.type";
import { MessageModel } from "../models/message.model";

export const server = createServer(app);
const io = new Server(server);
const activeUsers: Map<string, Set<string>> = new Map<string, Set<string>>();

io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        throw new createHttpError.Unauthorized();
    }

    try {
        const { userId } = verify(token, process.env.JWT_SECRET!) as JwtPayload;

        if (!(await UserModel.findById(userId))) {
            throw new createHttpError.Unauthorized();
        }

        socket.data.currentUser = { userId };

        next();
    } catch (e) {
        throw new createHttpError.Unauthorized();
    }
});

io.on("connection", socket => {
    const userId = socket.data.currentUser.userId;

    if (!activeUsers.has(userId)) {
        activeUsers.set(userId, new Set());
    }

    activeUsers.get(userId)!.add(socket.id);

    socket.on("disconnect", () => {
        const userSocketIds: Set<string> | undefined = activeUsers.get(userId);

        userSocketIds?.delete(socket.id);

        if (userSocketIds?.size === 0) {
            activeUsers.delete(userId);
        }
    });

    socket.on("join_chat", async (chatId: string) => {
        const userId = socket.data.currentUser.userId;

        await ChatService.isUserInChat(chatId, userId);

        await socket.join(chatId);
    });

    socket.on("send_message", async (dto: MessageDto) => {
        const { chatId } = dto;
        const currUserId: string = socket.data.currentUser.userId;
        const chat = await ChatService.isUserInChat(chatId, currUserId);

        for (const userId of chat.users) {
            const id: string = userId.toString();
            const userSocketIds: Set<string> | undefined = activeUsers.get(id);

            for (const socketId of userSocketIds || []) {
                const userSocket = io.sockets.sockets.get(socketId);

                if (userSocket?.rooms.has(chatId)) {
                    await userSocket.join(chatId);
                }
            }
        }

        const message = await MessageModel.create(dto);

        io.to(chatId).emit("new_message", message);
    });
});