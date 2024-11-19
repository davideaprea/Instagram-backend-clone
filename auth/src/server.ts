import { connect } from "mongoose";
import { app } from ".";
import { AuthTopics } from "@ig-clone/common";
import { kafka } from "./configs/kafka.config";
import { authProducer } from "./producers/auth.producer";
import { profileConsumer } from "./consumers/profile.consumer";

const init = async (): Promise<void> => {
    try {
        await connect(process.env.LOCAL_DB_URL!);
        console.log("Successully connected to the database.");
    } catch (e) {
        console.log("Couldn't connect to the database.", e);
    }

    try {
        await profileConsumer.connect();

        const admin = kafka.admin();

        await admin.connect();
        await admin.createTopics({
            topics: [
                {
                    topic: AuthTopics.USER_CREATE,
                    numPartitions: 1,
                    replicationFactor: 1,
                },
            ],
        });
        await admin.disconnect();
        
        await authProducer.connect()

        console.log("Successully connected to the kafka broker.");
    } catch (e) {
        console.log("Couldn't connect to kafka.", e);
    }

    app.listen(
        3000,
        () => console.log(`Server running at http://localhost:${3000}.`)
    );
}

init();