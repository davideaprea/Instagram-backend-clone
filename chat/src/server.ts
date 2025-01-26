import { initMongoConnection } from "./config/init-mongo-connection.config";
import { server } from "./config/socket.config";

const init = async (): Promise<void> => {
    await initMongoConnection();

    server.listen(
        3000,
        () => console.log(`Server running at http://localhost:${3000}.`)
    );
}

init();