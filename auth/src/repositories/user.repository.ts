import { UserModel } from "../models/user.model";
import { UserDocument } from "../types/user-document.type";
import { User } from "../types/user.type";

export namespace UserRepository {
    export const deleteUser = async (id: string): Promise<void> => {
        await UserModel.deleteOne(
            { _id: id },
            { writeConcern: { w: "majority" } }
        );
    }

    export const createUser = async (dto: User): Promise<UserDocument> => {
        const user = new UserModel(dto);

        await user.save({ w: "majority" });

        return user;
    }

    export const getUserByEmail = async (email: string): Promise<UserDocument | null> => {
        return await UserModel
            .findOne({ email })
            .populate("password")
            .readConcern("majority");
    }
}