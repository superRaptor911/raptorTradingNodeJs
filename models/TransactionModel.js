const mongoose = require('mongoose');

const transModel = new mongoose.Schema({
  username: {
    type: String,
  },
  coin: String,
  coinCount: Number,
  cost: Number,
  transType: String,
  fee: Number,
  time: Date,
});

const TransactionModel = mongoose.model('Transactions', transModel);
module.exports = TransactionModel;
