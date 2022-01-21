const mongoose = require('mongoose');

const stopLossModel = new mongoose.Schema({
  username: String,
  isEnabled: {
    type: Boolean,
    default: false,
  },
  coinId: String,
  transType: String,
  condition: String,

  price: Number,
  count: Number,
  orderId: {type: String, default: null},
  placeTime: Date,
});

const StopLossModel = mongoose.model('StopLossModel', stopLossModel);
module.exports = StopLossModel;
