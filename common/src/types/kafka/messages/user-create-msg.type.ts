import { Profile } from "../../profile.type";

export type UserCreateMsg = Pick<Profile, "username" | "fullName"> & {
    id: string
};