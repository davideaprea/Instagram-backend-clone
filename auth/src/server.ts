import { app } from ".";
import { authProducer } from "./producers/auth.producer";
import { profileConsumer } from "./consumers/profile.consumer";
import { initMongoConnection } from "./configs/init-mongo-connection.config";
import { initKafkaTopics } from "./configs/kafka-topics.config";

const init = async (): Promise<void> => {
    await initMongoConnection();

    try {
        await profileConsumer.connect();

        await initKafkaTopics();
        
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