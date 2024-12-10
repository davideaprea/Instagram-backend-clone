import { BlockModel } from "@ig-clone/common";
import { ClientSession } from "mongoose";

export namespace BlockRepository {
    export const areUsersBlocked = async (userId: string, blockedUserId: string, session?: ClientSession): Promise<boolean> => {
        const block = await BlockModel.findOne(
            {
                $or: [
                    { userId, blockedUserId },
                    { userId: blockedUserId, blockedUserId: userId }
                ]
            },
            undefined,
            { session }
        );

        return !!block;
    }
}