import express from 'express';
import bodyParser from 'body-parser';
import usageRouter from './routers/usage.route.js';
import * as ws from './websockets/index.js';
import * as dbo from './db/conn.js';
import * as web3 from './web3/conn.js';
import { setDb } from './services/usage.service.js';
import cors from 'cors';

web3.init();
dbo.connectToServer((err) => {
  err ? handleError() : '';
  setDb();
  const BASE_URL = '/api/v1';
  const port = 3333;

  const app = express();

  app.use(bodyParser.json());
  app.use(
    cors({
      origin: '*',
    })
  );

  app.get(`${BASE_URL}/`, (_req, res) => {
    res.json({ message: 'ok' });
  });

  app.use(`${BASE_URL}/usage`, usageRouter);

  const server = app.listen(port, () =>
    console.log('Listening on Port ' + port)
  );

  ws.init(server);
});

const handleError = (err) => {
  console.error(err);
  process.exit();
};
