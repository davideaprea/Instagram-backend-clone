import { Profile } from "./profile.type";

export type ProfileSearch = Pick<Profile, "username" | "fullName" | "profilePic">;