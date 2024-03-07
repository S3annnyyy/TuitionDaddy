import express from "express";
import routesHandler from "./routes/index.js";
import cors from "cors";
import db from "./libs/db.js";

function startServer(port) {
    const app = express();

    // App configs or middleware setups here
    app.use(cors());
    app.use(express.json());

    routesHandler.setupRoutes(app);

    db.verifyConnection();

    app.listen(port, 'localhost', (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Started server at: ' + port);
    });
}

export default {startServer};