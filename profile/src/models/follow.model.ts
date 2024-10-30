import { model, Model, Schema, Types } from "mongoose";
import { FollowRequestStatus } from "../types/enums/follow-request-status.enum";
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
    status: {
        type: String,
        enum: Object.values(FollowRequestStatus),
        required: true,
        default: FollowRequestStatus.PENDING
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