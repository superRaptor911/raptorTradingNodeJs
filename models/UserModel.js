const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  email: String,
  avatar: String,
  wallet: {
    balance: {
      type: Number,
      default: 0,
    },
    investment: {
      type: Number,
      default: 0,
    },
    coins: [],
  },
});

const UserModel = mongoose.model('User', userModel);
module.exports = UserModel;
