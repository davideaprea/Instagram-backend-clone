import { ObjectId } from "mongoose";
import { Gender } from "../enums/gender.enum";

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
};