import { compareSync, hashSync } from "bcrypt";
import { UserModel } from "../models/user.model";
import { LoginDto } from "../types/login-dto.type";
import { UserDocument } from "../types/user-document.type";
import { User } from "../types/user.type";
import createHttpError from "http-errors";
import { LoginResponse } from "../types/login-response.type";
import { generateJwt } from "./jwt-manager.service";
import { Error } from "mongoose";
import { AuthResponse } from "../types/auth-response.type";

export namespace AuthService {
    export const register = async (registerDto: User): Promise<AuthResponse> => {
        const user = new UserModel(registerDto);

        const err: Error.ValidationError | null = user.validateSync();

        if (err) throw err;

        user.password = hashSync(user.password, 12);

        const { username, fullName, id } = await user.save({ validateBeforeSave: false });

        return { username, fullName, id };
    }

    export const login = async (loginDto: LoginDto): Promise<LoginResponse> => {
        const userDoc: UserDocument | null = await UserModel.findOne({ email: loginDto.email }).populate("password");

        if (
            !userDoc ||
            !compareSync(loginDto.password, userDoc.password)
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