import { AuthResponse } from "./auth-response.type";

export type LoginResponse = AuthResponse & {
    jwt: string
};