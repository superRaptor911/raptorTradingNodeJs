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

const LokedAssetModel = mongoose.model('LokedAssetModel', lokedAssetModel);
module.exports = LokedAssetModel;
