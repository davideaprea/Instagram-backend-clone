import { initMongoConnection } from "./config/init-mongo-connection.config";
import { server } from "./config/socket.config";

const init = async (): Promise<void> => {
    await initMongoConnection();

    try {
        console.log("Successully connected to the kafka broker.");
    } catch (e) {
        console.log("Couldn't connect to kafka.", e);
    }

    server.listen(
        3000,
        () => console.log(`Server running at http://localhost:${3000}.`)
    );
}

init();