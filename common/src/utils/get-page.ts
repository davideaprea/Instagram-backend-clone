import { FilterQuery, Model, ObjectId, Schema } from "mongoose";

export const getPage = async <T>(Model: Model<T>, filters: FilterQuery<T>, limit: number = 10, lastReqId?: string | ObjectId): Promise<T[]> => {
    if(typeof lastReqId == "string") {
        lastReqId = new Schema.Types.ObjectId(lastReqId);
    }
    
    if (lastReqId) filters._id = { $gt: lastReqId };
    if (limit > 50 || limit <= 0) limit = 10;

    return await Model
        .find(filters)
        .sort({ _id: 1 })
        .limit(limit);
}