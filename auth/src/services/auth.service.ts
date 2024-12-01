import { compareSync, hashSync } from "bcrypt";
import { LoginDto } from "../types/login-dto.type";
import { UserDocument } from "../types/user-document.type";
import { User } from "../types/user.type";
import createHttpError from "http-errors";
import { LoginResponse } from "../types/login-response.type";
import { generateJwt } from "./jwt-manager.service";
import { AuthResponse } from "../types/auth-response.type";
import { UserRepository } from "../repositories/user.repository";

export namespace AuthService {
    export const register = async (dto: User): Promise<AuthResponse> => {
        dto.password = hashSync(dto.password, 12);

        const { username, fullName, id } = await UserRepository.createUser(dto);

        return { username, fullName, id };
    }

    export const login = async (dto: LoginDto): Promise<LoginResponse> => {
        const { email, password } = dto;
        const userDoc: UserDocument | null = await UserRepository.getUserByEmail(email);

        if (
            !userDoc ||
            !compareSync(password, userDoc.password)
        ) {
            throw new createHttpError.BadRequest("Incorrect email or password.");
        }

        return {
            username: userDoc.username,
            fullName: userDoc.fullName,
            jwt: generateJwt(userDoc.id)
        };
    }
}