const mongoose = require('mongoose');

const stopLossModel = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  isEnabled: {
    type: Boolean,
    default: false,
  },
  coinId: String,
  transType: String,
  price: Number,
  count: Number,
  orderId: {type: String, default: null},
  placeTime: Date,
});

const StopLossModel = mongoose.model('StopLossModel', stopLossModel);
module.exports = StopLossModel;
