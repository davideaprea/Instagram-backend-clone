import { connect } from "mongoose";

export const initMongoConnection = async (): Promise<void> => {
    const env = process.env;

    try {
        await connect(`mongodb://user-admin:my-secure-password@profile-mongo-0.profile-mongo-svc.default.svc.cluster.local:27017,profile-mongo-1.profile-mongo-svc.default.svc.cluster.local:27017,profile-mongo-2.profile-mongo-svc.default.svc.cluster.local:27017`, {
            dbName: env.DB_NAME,
            replicaSet: env.REPLSET_NAME,
            serverSelectionTimeoutMS: 90000
        });

        console.log("Successully connected to the database.");
    } catch (e) {
        console.log("Couldn't connect to the database.", e);
    }
}