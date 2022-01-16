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
  rules: [
    {
      id: Number,
      isEnabled: Boolean,
      coinId: String,
      transType: String,
      price: Number,
      count: Number,
      orderId: {type: Number, default: 0},
      placeTime: Date,
    },
  ],
});

const StopLossModel = mongoose.model('StopLossModel', stopLossModel);
module.exports = StopLossModel;
