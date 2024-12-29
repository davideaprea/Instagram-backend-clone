import { model, Model, Schema } from "mongoose";
import { User } from "../types/user.type";
import { InteractionRule } from "@ig-clone/common/dist/types/interaction-rule.enum";
import { ProfileVisibility } from "@ig-clone/common/dist/types/profile-visibility.enum";
import { SchemaNames } from "../types/schema-names.enum";

const userSchema = new Schema<User, Model<User>>({
    username: {
        type: String,
        unique: true
    },
    profilePic: String,
    interactionRules: {
        tag: {
            type: String,
            default: InteractionRule.EVERYONE
        },
        mention: {
            type: String,
            default: InteractionRule.EVERYONE
        },
        visibility: {
            type: String,
            enum: Object.values(ProfileVisibility)
        }
    }
});

export const UserModel = model<User, Model<User>>(SchemaNames.USER, userSchema);