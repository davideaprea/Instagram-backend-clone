import { UserCreateMsg } from "./user-create-msg.type";
import { AuthTopics } from "../topics/auth-topics.enum";

export type AuthEvents = {
    [AuthTopics.USER_CREATE]: UserCreateMsg
};