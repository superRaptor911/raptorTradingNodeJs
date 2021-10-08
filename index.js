const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
require('./db/db');

const {CoinRouter} = require('./routes/Coins');

const app = express();
const port = 8080;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/coins', CoinRouter);

app.listen(port, () => {
  console.log(`app listening at port ${process.env.PORT}`);
});
