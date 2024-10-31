import { Profile } from "../../profile.type";

export type ProfileUpdateEventPayload = Pick<Profile, "biography" | "fullName" | "gender" | "username" | "profilePic">;