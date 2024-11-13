import { Types } from "mongoose";

export type Credentials = {
    id: Types.ObjectId,
    token: string
};