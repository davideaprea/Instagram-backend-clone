import { model, Schema } from "mongoose";;
import { User } from "../types/user.type";
import { AuthSchemaNames } from "../types/auth-schema-names.enum";
import { UserMongoModel } from "../types/user-mongo-model.type";

const userSchema = new Schema<User, UserMongoModel>(
    {
        email: {
            type: String,
            trim: true,
            required: [true, "Email is required."],
            unique: true,
            match: [new RegExp(process.env.EMAIL_REGEX!), "The given email is not valid."]
        },
        username: {
            type: String,
            required: [true, "The username is required."],
            unique: true,
            trim: true,
            match: [new RegExp(process.env.USERNAME_REGEX!), "The username is not valid."]
        },
        password: {
            type: String,
            trim: true,
            required: [true, "Password is required for standard registration."],
            match: [new RegExp(process.env.PSW_REGEX!), "Password must be at least 8 characters long, include a number, a special character, an uppercase character and a lowercase character."],
            select: false
        },
        fullName: {
            type: String,
            trim: true,
            required: [true, "Full name is required."],
            match: [new RegExp(process.env.NAME_REGEX!), "The username is not valid."]
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        },
        versionKey: false
    }
);

export const UserModel = model<User, UserMongoModel>(AuthSchemaNames.USER, userSchema);