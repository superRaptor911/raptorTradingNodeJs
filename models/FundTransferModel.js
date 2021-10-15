const mongoose = require('mongoose');

const fundTransfer = new mongoose.Schema({
  username: String,
  amount: Number,
  transType: String,
  fee: Number,
  donation: Number,
  time: Date,
});

const FundTransferModel = mongoose.model('FundTransferModel', fundTransfer);
module.exports = FundTransferModel;
