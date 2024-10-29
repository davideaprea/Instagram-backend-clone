import { compareSync, hashSync } from "bcrypt";
import { UserModel } from "../models/user.model";
import { AuthResponse } from "../types/auth-response.type";
import { LoginDto } from "../types/login-dto.type";
import { UserDocument } from "../types/user-document.type";
import { User } from "../types/user.type";
import createHttpError from "http-errors";
import { LoginResponse } from "../types/login-response.type";
import { generateJwt } from "./jwt-manager.service";

export const register = async (registerDto: User): Promise<AuthResponse> => {
    const user = new UserModel(registerDto);

    user.validateSync();

    user.password = hashSync(user.password, 12);

    const { username, fullName } = await user.save({validateBeforeSave: false});

    return { username, fullName };
}

export const login = async (loginDto: LoginDto): Promise<LoginResponse> => {
    const userDoc: UserDocument | null = await UserModel.findOne({ email: loginDto.email });

    if (
        !userDoc ||
        !compareSync(loginDto.password, userDoc.password)
    ) {
        throw new createHttpError.BadRequest("Incorrect email or password.");
    }

    return {
        username: userDoc.username,
        fullName: userDoc.fullName,
        jwt: generateJwt(userDoc.username)
    };
}