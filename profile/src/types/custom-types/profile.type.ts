import { ObjectId } from "mongoose";
import { Gender } from "../enums/gender.enum";
import { ProfileVisibility } from "../enums/profile-visibility.enum";
import { InteractionRule } from "../enums/interaction-rule.enum";

export type Profile = {
    readonly userId: ObjectId
    followers: number
    posts: number
    following: number
    biography?: string
    gender?: Gender
    visibility: ProfileVisibility
    profilePic?: string
    username: string
    fullName: string
    readonly time: number,
    interactionRules: {
        tag: InteractionRule,
        mention: InteractionRule
    }
};