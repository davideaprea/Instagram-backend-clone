import { model, Schema } from "mongoose";
import { User } from "../types/user.type";
import { AuthSchemaNames } from "../types/auth-schema-names.enum";
import { UserMongoModel } from "../types/user-mongo-model.type";

const userSchema = new Schema<User, UserMongoModel>(
    {
        email: {
            required: true,
            type: String,
            unique: true
        },
        username: {
            required: true,
            type: String,
            unique: true
        },
        password: {
            type: String,
            select: false
        },
        fullName: {
            required: true,
            type: String
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