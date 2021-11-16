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

const port = process.env.PORT;

const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  if (req.path !== '/users/login' && req.method === 'POST') {
    try {
      const {password} = req.body;
      if (password !== process.env.PASS) {
        throw 'Wrong Pass';
      }
      next();
    } catch (e) {
      console.error('index::', e);
      res.status(500).json({status: false, message: e});
    }
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/coins', CoinRouter);
app.use('/users', UserRouter);
app.use('/fund', FundTransferRouter);
app.use('/transaction', TransactionRouter);

app.listen(port, () => {
  console.log(`app listening at port ${port}`);
});
