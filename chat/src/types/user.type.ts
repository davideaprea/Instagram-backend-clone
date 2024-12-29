import { Profile } from "@ig-clone/common";

export type User = Pick<Profile, "username" | "fullName" | "profilePic" | "interactionRules">;