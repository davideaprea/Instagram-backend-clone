import { UserCreateDto } from "../messages/user-create-dto.type";
import { AuthTopics } from "../topics/auth-topics.enum";

export type AuthEvents = {
    [AuthTopics.USER_CREATE]: UserCreateDto
};