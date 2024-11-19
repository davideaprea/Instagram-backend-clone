import { EditProfileDto } from "../messages/edit-profile-dto.type";
import { ProfileTopics } from "../topics/profile-topics.enum";

export type ProfileEvents = {
    [ProfileTopics.PROFILE_UPDATE]: EditProfileDto
};