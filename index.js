/* eslint-disable no-throw-literal */
const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
require('./db/db');

const {CoinRouter} = require('./routes/Coins');
const {UserRouter} = require('./routes/User');
const {FundTransferRouter} = require('./routes/FundTransfer');
const {TransactionRouter} = require('./routes/Transaction');
const {WazirxRouter} = require('./routes/Wazirx');

const port = process.env.PORT;

const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  if (req.path === '/users/login' || req.method === 'GET') {
    next();
  } else if (req.path.split('/')[1] === 'wazirx') {
    next();
  } else {
    try {
      const {password} = req.body;
      if (password !== process.env.PASS) {
        throw 'Wrong Admin Password';
      }
      next();
    } catch (e) {
      console.error('index::', e);
      res.status(500).json({status: false, message: e});
    }
    next();
  }
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use('/coins', CoinRouter);
app.use('/users', UserRouter);
app.use('/fund', FundTransferRouter);
app.use('/transaction', TransactionRouter);
app.use('/wazirx', WazirxRouter);

app.listen(port, () => {
  console.log(`app listening at port ${port}`);
});
