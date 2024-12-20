import { app } from ".";
import { initMongoConnection } from "./configs/init-mongo-connection.config";
import { initKafkaTopics } from "./configs/kafka-topics.config";
import { initAuthConsumer } from "./consumers/auth.consumer";
import { initProfileConsumer } from "./consumers/profile.consumer";
import { postProducer } from "./producers/post.producer";

const init = async (): Promise<void> => {
    await initMongoConnection();

    try {
        await initKafkaTopics();
        
        await initAuthConsumer();
        await initProfileConsumer();

        await postProducer.connect();

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