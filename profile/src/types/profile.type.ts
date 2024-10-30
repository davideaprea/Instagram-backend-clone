import { ObjectId } from "mongoose";
import { Gender } from "./gender.enum";
import { ProfileVisibility } from "./profile-visibility.enum";

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
    readonly time: number
};