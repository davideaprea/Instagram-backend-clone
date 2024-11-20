import { Profile } from "../../profile.type";

export type EditProfileMsg = Partial<Pick<Profile, "biography" | "gender" | "username" | "fullName">> & {
    id: string
};