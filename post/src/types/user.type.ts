import { Profile } from "@ig-clone/common";

export type User = Pick<Profile, "username" | "profilePic" | "interactionRules">;