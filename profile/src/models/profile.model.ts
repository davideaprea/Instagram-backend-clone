import { Model, model, Schema, Types } from "mongoose";
import { Profile } from "../types/profile.type";
import { Gender } from "../types/gender.enum";
import { ProfileVisibility } from "../types/profile-visibility.enum";
import { ProfileSchemaNames } from "../types/profile-schema-names.enum";

const profileSchema = new Schema<Profile, Model<Profile>>({
    userId: {
        type: Types.ObjectId,
        required: [true, "User id is required."],
        immutable: true,
        unique: [true, "The profile for this user is already defined."]
    },
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
    visibility: {
        type: String,
        enum: Object.values(ProfileVisibility),
        default: ProfileVisibility.PUBLIC,
        required: true
    },
    profilePic: String,
    username: {
        type: String,
        required: [true, "Username is required."]
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
    }
});

export const ProfileModel = model<Profile, Model<Profile>>(ProfileSchemaNames.PROFILE, profileSchema);