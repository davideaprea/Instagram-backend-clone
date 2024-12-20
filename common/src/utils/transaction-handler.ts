import { ClientSession, startSession } from "mongoose";
import { TransactionOptions } from "mongodb";

export const transactionHandler = <TArgs extends any[], TResult>(
    cb: (session: ClientSession, ...args: TArgs) => Promise<TResult>,
    transactionOptions?: TransactionOptions
): (...args: TArgs) => Promise<TResult> => {
    return async (...args: TArgs): Promise<TResult> => {
        const session: ClientSession = await startSession();
        session.startTransaction(transactionOptions);

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