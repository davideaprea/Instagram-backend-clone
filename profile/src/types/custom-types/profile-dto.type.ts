import { Profile } from "@ig-clone/common";

export type ProfileDto = Pick<Profile, "userId" | "username" | "fullName">;