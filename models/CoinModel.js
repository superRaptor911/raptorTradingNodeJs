const mongoose = require('mongoose');

const coinModel = new mongoose.Schema({
  name: String,
  id: String,
  previewImg: String,
});

const CoinModel = mongoose.model('Coin', coinModel);
module.exports = CoinModel;
