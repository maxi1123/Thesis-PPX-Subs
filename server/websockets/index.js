import { WebSocketServer } from "ws";
import queryString from "query-string";

import * as dbo from "../db/conn.js";

const dbConnect = dbo.getDb();

export const init = (expressServer) => {
    const websocketServer = new WebSocketServer({
        noServer: true,
        path: "/websockets",
    });

    expressServer.on("upgrade", (request, socket, head) => {
        websocketServer.handleUpgrade(request, socket, head, (websocket) => {
            websocketServer.emit("connection", websocket, request);
        });
    });

    websocketServer.on(
        "connection",
        function connection(websocketConnection, connectionRequest) {
            const [_path, params] = connectionRequest?.url?.split("?");
            const connectionParams = queryString.parse(params);

            console.log(connectionParams);

            websocketConnection.on("message", (message) => {
                const parsedMessage = JSON.parse(message);
                const usageDocument = {
                    id: 12345678,
                    start_date: 22345,
                    end_date: 22566,
                    license_key: "HBC123-HBC123-HBC123",
                };
                dbConnect
                    .collection("usage")
                    .insertOne(usageDocument, function (err, result) {
                        if (err) {
                            res.status(400).send("Error inserting matches!");
                        } else {
                            console.log(
                                `Added a new match with id ${result.insertedId}`
                            );
                        }
                    });
            });
        }
    );

    return websocketServer;
};
