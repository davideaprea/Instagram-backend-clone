import { model, Model, Schema, Types } from "mongoose";
import { ProfileSchemaNames } from "../types/enums/profile-schema-names.enum";
import { Follow } from "../types/custom-types/follow.type";

const followSchema = new Schema<Follow, Model<Follow>>({
    userId: {
        type: Types.ObjectId,
        required: [true, "User id is required."],
        immutable: true
    },
    followingUserId: {
        type: Types.ObjectId,
        required: [true, "Following user id is required."],
        immutable: true
    },
    time: {
        type: Number,
        immutable: true,
        required: true,
        default: Date.now()
    }
});

followSchema.index({ userId: 1, followingUserId: 1 }, { unique: true });

export const FollowModel = model<Follow, Model<Follow>>(ProfileSchemaNames.FOLLOW, followSchema);
export const FollowRequestModel = model<Follow, Model<Follow>>(ProfileSchemaNames.FOLLOW_REQUEST, followSchema);