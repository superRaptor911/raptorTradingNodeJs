const mongoose = require('mongoose');

const donModel = new mongoose.Schema({
  username: String,
  amount: Number,
  transId: String,
});

const DonationModel = mongoose.model('Donations', donModel);
module.exports = DonationModel;
