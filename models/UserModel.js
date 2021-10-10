const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  email: String,
  avatar: String,
});

const UserModel = mongoose.model('User', userModel);
module.exports = UserModel;
