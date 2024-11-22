import { Model, model, Schema } from "mongoose";
import { ProfileSchemaNames } from "../types/enums/profile-schema-names.enum";
import { Gender, Profile } from "@ig-clone/common";
import { InteractionRule } from "@ig-clone/common/dist/types/interaction-rule.enum";
import { ProfileVisibility } from "@ig-clone/common/dist/types/profile-visibility.enum";

const profileSchema = new Schema<Profile, Model<Profile>>({
    followers: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    posts: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    following: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    biography: {
        type: String,
        max: [150, "Biographies can't be more than 150 characters long."]
    },
    gender: {
        type: String,
        enum: Object.values(Gender)
    },
    profilePic: String,
    username: {
        type: String,
        required: [true, "Username is required."],
        unique: true
    },
    fullName: {
        type: String,
        required: [true, "Full name is required."]
    },
    time: {
        type: Number,
        immutable: true,
        required: true,
        default: Date.now()
    },
    interactionRules: {
        tag: {
            type: String,
            required: true,
            default: InteractionRule.EVERYONE,
            enum: Object.values(InteractionRule)
        },
        mention: {
            type: String,
            required: true,
            default: InteractionRule.EVERYONE,
            enum: Object.values(InteractionRule)
        },
        visibility: {
            type: String,
            enum: Object.values(ProfileVisibility),
            default: ProfileVisibility.PUBLIC,
            required: true
        }
    }
});

profileSchema.index({ username: "text", fullName: "text" });

export const ProfileModel = model<Profile, Model<Profile>>(ProfileSchemaNames.PROFILE, profileSchema);