import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {initDB} from './db/db';

dotenv.config();
initDB();

import {authorize} from './auth';
import {execBots} from './bots/bots';
import CoinRouter from './routes/Coins';
import FundTransferRouter from './routes/FundTransfer';
import TransactionRouter from './routes/Transaction';
import UserRouter from './routes/User';
import WazirxRouter from './routes/Wazirx';
import {wazirxTransChecker} from './wazirx/transactions';

const port = process.env.PORT;

const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// Authorise request
app.use(authorize);

app.get('/', (_req, res) => res.send('Hello World!'));

app.use('/coins', CoinRouter);
app.use('/users', UserRouter);
app.use('/fund', FundTransferRouter);
app.use('/transaction', TransactionRouter);
app.use('/wazirx', WazirxRouter);

app.listen(port, () => {
  console.log(`app listening at port ${port}`);
});

wazirxTransChecker();
execBots();
