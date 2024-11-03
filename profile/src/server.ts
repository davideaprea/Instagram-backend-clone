import { connect } from "mongoose";
import { app } from ".";
import { initAuthConsumer } from "./consumers/auth.consumer";

const init = async (): Promise<void> => {
    try {
        await connect(process.env.LOCAL_DB_URL!);
        console.log("Successully connected to the database.");
    } catch (e) {
        console.log("Couldn't connect to the database.", e);
    }

    await initAuthConsumer();

    app.listen(
        3000,
        () => console.log(`Server running at http://localhost:${3000}.`)
    );
}

init();