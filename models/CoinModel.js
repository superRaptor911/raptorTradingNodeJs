const mongoose = require('mongoose');

const coinModel = new mongoose.Schema({
  name: String,
  id: {
    type: String,
    unique: true,
  },
  avatar: String,
});

const CoinModel = mongoose.model('Coin', coinModel);
module.exports = CoinModel;
