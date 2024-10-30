import { Profile } from "./profile.type";

export type ProfileDto = Pick<Profile, "userId" | "username" | "fullName">;