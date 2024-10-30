import { ObjectId } from "mongoose";
import { Gender } from "./gender.enum";
import { ProfileVisibility } from "./profile-visibility.enum";

export type Profile = {
    userId: ObjectId
    followers: number
    posts: number
    following: number
    biography?: string
    gender?: Gender
    visibility: ProfileVisibility
    profilePic?: string
    username: string
    fullName: string
    time: number
};