import { UserModel } from "../models/user.model";
import { UserDocument } from "../types/user-document.type";

export namespace UserRepository {
    export const getUserByEmail = async (email: string): Promise<UserDocument | null> => {
        return await UserModel
            .findOne({ email })
            .populate("password");
    }
}