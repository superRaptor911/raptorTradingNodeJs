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
  coins: Object,
});

const StopLossModel = mongoose.model('StopLossModel', stopLossModel);
module.exports = StopLossModel;
