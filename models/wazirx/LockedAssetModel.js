const mongoose = require('mongoose');

const lokedAssetModel = new mongoose.Schema({
  username: String,
  id: {
    type: String,
    unique: true,
  },
  asset: String,
  amount: Number,
});

const LockedAssetModel = mongoose.model('LockedAssetModel', lokedAssetModel);
module.exports = LockedAssetModel;
