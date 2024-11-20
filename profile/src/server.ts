import { app } from ".";
import { profileProducer } from "./producers/profile.producer";
import { initMongoConnection } from "./configs/init-mongo-connection.config";
import { initKafkaTopics } from "./configs/kafka-topics.config";
import { authConsumer } from "./consumers/auth.consumer";

const init = async (): Promise<void> => {
    await initMongoConnection();

    try {
        await authConsumer.connect();

        await initKafkaTopics();

        await profileProducer.connect();

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