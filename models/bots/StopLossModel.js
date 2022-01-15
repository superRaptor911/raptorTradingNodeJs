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
      coinId: String,
      sellPrice: Number,
      buyPrice: Number,
      count: Number,
      sellExecuted: {type: Boolean, default: false},
    },
  ],
});

const StopLossModel = mongoose.model('StopLossModel', stopLossModel);
module.exports = StopLossModel;
