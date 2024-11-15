import Joi from "joi";
import { EditProfileDto } from "../types/custom-types/edit-profile-dto.type";
import { Gender, NAME_REGEX, USERNAME_REGEX } from "@ig-clone/common";

const genders: Gender[] = Object.values(Gender);

export const editProfileSchema = Joi.object<EditProfileDto>({
    biography: Joi.string().max(150).message("Biographies can't have more than 150 characters."),
    gender: Joi.string().valid(genders).message("Invalid gender key. Possible values: " + genders.join(", ")),
    username: Joi.string().pattern(USERNAME_REGEX).message("Invalid username."),
    fullName: Joi.string().pattern(NAME_REGEX).message("Invalid name.")
})
.min(1);