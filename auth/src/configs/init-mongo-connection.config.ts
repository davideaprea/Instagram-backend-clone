import { connect } from "mongoose";

export const initMongoConnection = async (): Promise<void> => {
    const env = process.env;
    const urls: string[] = [];

    for(let i = 0; i < 3; i++) {
        urls.push(`${env.MEMBER_BASE_NAME}-${i}.${env.MONGO_HOST}`);
    }

    try {
        await connect(`mongodb://user-admin:my-secure-password@${urls.join(",")}`, {
            dbName: env.DB_NAME,
            replicaSet: env.REPLSET_NAME,
            serverSelectionTimeoutMS: 90000,
            writeConcern: {
                w: "majority"
            },
            readConcern: "majority"
        });
        console.log("Successully connected to the database.");
    } catch (e) {
        console.log("Couldn't connect to the database.", e);
    }
}