import { model, Model, Schema, Types } from "mongoose";
import { ProfileSchemaNames } from "../types/enums/profile-schema-names.enum";
import { Block } from "../types/custom-types/block.type";

const blockSchema = new Schema<Block, Model<Block>>({
    userId: {
        type: Types.ObjectId,
        required: [true, "User id is required."],
        immutable: true
    },
    blockedUserId: {
        type: Types.ObjectId,
        required: [true, "Blocked user id is required."],
        immutable: true
    }
});

blockSchema.index({ userId: 1, blockedUserId: 1 }, { unique: true });

export const BlockModel = model<Block, Model<Block>>(ProfileSchemaNames.BLOCK, blockSchema);