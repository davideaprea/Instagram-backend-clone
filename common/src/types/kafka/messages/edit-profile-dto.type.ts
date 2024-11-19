import { Profile } from "../../profile.type";

export type EditProfileDto = Partial<Pick<Profile, "biography" | "gender" | "username" | "fullName">>;