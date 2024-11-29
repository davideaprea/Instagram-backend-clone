import { connect } from "mongoose";

export const initMongoConnection = async (): Promise<void> => {
    const env = process.env;

    try {
        await connect(`mongodb://user-admin:my-secure-password@auth-mongo-0.auth-mongo-svc.default.svc.cluster.local:27017,auth-mongo-1.auth-mongo-svc.default.svc.cluster.local:27017,auth-mongo-2.auth-mongo-svc.default.svc.cluster.local:27017`, {
            dbName: env.DB_NAME,
            replicaSet: env.REPLSET_NAME,
            serverSelectionTimeoutMS: 60000
        });
        console.log("Successully connected to the database.");
    } catch (e) {
        console.log("Couldn't connect to the database.", e);
    }
}