import { Profile } from "../../profile.type";
import { ProfileTopics } from "../topics/profile-topics.enum";

export type ProfileUpdateEvent = {
    topic: ProfileTopics.PROFILE_UPDATE
    messages: Pick<Profile, "biography" | "fullName" | "gender" | "username" | "profilePic">[]
};