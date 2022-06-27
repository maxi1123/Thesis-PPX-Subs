import express from "express";
import bodyParser from "body-parser";
import usageRouter from "./routers/usage.route.js";
import * as ws from "./websockets/index.js";
import * as dbo from "./db/conn.js";

dbo.connectToServer((err) => {
    if (err) {
        console.error(err);
        process.exit();
    }
    const BASE_URL = "/api/v1";
    const port = 3000;

    const app = express();

    app.use(bodyParser.json());

    app.get(`${BASE_URL}/`, (_req, res) => {
        res.json({ message: "ok" });
    });

    app.use(`${BASE_URL}/usage`, usageRouter);

    const server = app.listen(port, () =>
        console.log("Listening on Port " + port)
    );

    ws.init(server);
});
