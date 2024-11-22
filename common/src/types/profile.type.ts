import { ObjectId } from "mongoose";
import { Gender } from "./gender.enum";
import { ProfileInteractionRules } from "./profile-interaction-rules.type";

export type Profile = {
    readonly userId: ObjectId
    followers: number
    posts: number
    following: number
    biography?: string
    gender?: Gender
    profilePic?: string
    username: string
    fullName: string
    readonly time: number
    interactionRules: ProfileInteractionRules
};