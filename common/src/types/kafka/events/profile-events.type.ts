import { EditProfileMsg } from "../messages/edit-profile-msg.type";
import { ProfileTopics } from "../topics/profile-topics.enum";

export type ProfileEvents = {
    [ProfileTopics.PROFILE_UPDATE]: EditProfileMsg
};