import { FilterQuery, Model, ObjectId } from "mongoose";

export const getPage = async <T>(Model: Model<T>, filters: FilterQuery<T>, limit: number = 10, lastReqId?: ObjectId): Promise<T[]> => {
    if (lastReqId) filters._id = { $gt: lastReqId };
    if (limit > 50 || limit <= 0) limit = 10;

    return await Model
        .find(filters)
        .sort({ _id: 1 })
        .limit(limit);
}