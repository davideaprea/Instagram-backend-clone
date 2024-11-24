import { ProfileDocument } from "./profile-document.type";

export type ProfileDto = Pick<ProfileDocument, "username" | "fullName" | "_id">;