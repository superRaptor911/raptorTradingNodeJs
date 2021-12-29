const mongoose = require('mongoose');

const wazirxTrans = new mongoose.Schema({
  username: String,
  id: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    default: 'PENDING',
  },
  receipt: Object,
});

const WazirxTransactionModel = mongoose.model(
  'WazirxTransactionModel',
  wazirxTrans,
);
module.exports = WazirxTransactionModel;
