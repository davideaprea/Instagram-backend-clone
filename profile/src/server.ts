import { connect } from "mongoose";
import { app } from ".";
import { initAuthConsumer } from "./consumers/auth.consumer";
import { ProfileTopics } from "@ig-clone/common";
import { kafka } from "./configs/kafka.config";
import { profileProducer } from "./producers/profile.producer";

const init = async (): Promise<void> => {
    try {
        await connect(process.env.LOCAL_DB_URL!);
        console.log("Successully connected to the database.");
    } catch (e) {
        console.log("Couldn't connect to the database.", e);
    }

    try {
        await initAuthConsumer();

        const admin = kafka.admin();

        await admin.connect();
        await admin.createTopics({
            topics: [
                {
                    topic: ProfileTopics.PROFILE_UPDATE,
                    numPartitions: 1,
                    replicationFactor: 1,
                },
            ],
        });
        await admin.disconnect();

        await profileProducer.connect()

    } catch (e) {

    }

    app.listen(
        3000,
        () => console.log(`Server running at http://localhost:${3000}.`)
    );
}

init();