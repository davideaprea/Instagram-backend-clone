import { Profile } from "@ig-clone/common";

export type EditProfileDto = Pick<Profile, "biography" | "gender" | "username" | "profilePic" | "fullName">;