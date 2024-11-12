import { Profile } from "@ig-clone/common";

export type EditProfileDto = Partial<Pick<Profile, "biography" | "gender" | "username" | "profilePic" | "fullName">>;