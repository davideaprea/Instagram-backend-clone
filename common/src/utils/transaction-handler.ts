import { ClientSession, startSession } from "mongoose";

export const transactionHandler = <TArgs extends any[], TResult>(cb: (session: ClientSession, ...args: TArgs) => Promise<TResult>) => {
    return async (...args: TArgs): Promise<TResult> => {
        const session: ClientSession = await startSession();
        session.startTransaction();

        try {
            const res = await cb(session, ...args);

            await session.commitTransaction();

            return res;
        } catch (e) {
            await session.abortTransaction();

            throw e;
        } finally {
            session.endSession();
        }
    };
};