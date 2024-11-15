import { connect } from "mongoose";

export const initMongoConnection = async (): Promise<void> => {
    try {
        await connect(process.env.LOCAL_DB_URL!, {
            directConnection: true,
            replicaSet: "rs0",
            connectTimeoutMS: 40000,
            serverSelectionTimeoutMS: 40000
        });

        console.log("Successully connected to the database.");
    } catch (e) {
        console.log("Couldn't connect to the database.", e);
    }
}