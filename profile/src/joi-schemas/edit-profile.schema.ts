import Joi from "joi";
import { EditProfileDto } from "../types/custom-types/edit-profile-dto.type";
import { Gender, NAME_REGEX, USERNAME_REGEX } from "@ig-clone/common";

export const editProfileSchema = Joi.object<EditProfileDto>({
    biography: Joi.string().max(150),
    gender: Joi.string().valid(Object.values(Gender)),
    username: Joi.string().pattern(USERNAME_REGEX),
    fullName: Joi.string().pattern(NAME_REGEX)
});