import { app } from ".";
import { authProducer } from "./producers/auth.producer";
import { initMongoConnection } from "./configs/init-mongo-connection.config";
import { initKafkaTopics } from "./configs/kafka-topics.config";
import { initProfileConsumer } from "./consumers/profile.consumer";

const init = async (): Promise<void> => {
    await initMongoConnection();

    try {
        await initKafkaTopics();

        await initProfileConsumer();
        
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