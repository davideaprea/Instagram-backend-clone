import { UserModel } from "../../src/models/user.model";
import { io, Socket } from "socket.io-client";
import { faker } from "@faker-js/faker";
import { sign } from "jsonwebtoken";
import { DefaultEventsMap } from "socket.io";
import { MessageDto } from "../../src/types/message-dto.type";
import { ChatModel } from "../../src/models/chat.model";
import { ChatType } from "../../src/types/chat-type.enum";
import { server } from "../../src/config/socket.config";

type ConnectedUser = {
    id: string
    token: string
    socket: Socket<DefaultEventsMap, DefaultEventsMap>
};

describe("Sockets", () => {
    server.listen(3000);
    
    const connectedUsers: ConnectedUser[] = [];

    beforeAll(async () => {
        const newUsers: Omit<ConnectedUser, "socket">[] = [];

        for (let i = 0; i < 5; i++) {
            const user = await UserModel.create({
                username: faker.internet.username(),
                fullName: faker.person.fullName()
            });

            newUsers.push({
                id: user.id,
                token: sign({ userId: user.id }, process.env.JWT_SECRET!)
            });
        }


        for (const user of newUsers) {
            const clientSocket = io(`http:localhost:3000`, {
                auth: { token: user.token }
            });

            connectedUsers.push({
                ...user,
                socket: clientSocket
            });
        }
    });

    it("should send a private message", async () => {
        const sender: ConnectedUser = connectedUsers[0];
        const recipient: ConnectedUser = connectedUsers[1];
        const chat = await ChatModel.create({
            type: ChatType.PRIVATE,
            users: [sender.id, recipient.id]
        });
        const msg: MessageDto = {
            chatId: chat.id,
            senderId: sender.id,
            text: "Hi!"
        };
        console.log("Connected users", connectedUsers)

        recipient.socket.on("new_message", payload => {
            const receivedMsg = JSON.parse(payload);
            console.log("MSG", receivedMsg);
            expect(receivedMsg).toBe(msg);
        });

        sender.socket.emit(JSON.stringify(msg));
    });
});