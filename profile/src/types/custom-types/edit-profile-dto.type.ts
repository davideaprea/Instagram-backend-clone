import { Profile } from "./profile.type";

export type EditProfileDto = Pick<Profile, "biography" | "gender" | "visibility" | "username" | "profilePic" | "fullName">;