const CoinModel = require('../models/CoinModel');

async function coinRoot(_req, res) {
  try {
    const result = await CoinModel.find({});
    res.status(200).json({status: true, data: result});
  } catch (e) {
    console.error('Coins::coinRoot ', e);
    res.status(500).json({status: false, message: e});
  }
}

async function addCoin(req, res) {
  try {
    const {name, id, previewImg} = req.body;

    const doc = new CoinModel();
    doc.name = name;
    doc.previewImg = previewImg;
    doc.id = id;
    await doc.save();
    res.status(200).json({status: true, message: 'GG'});
  } catch (e) {
    console.error('Coins::addCoin ', e);
    console.log(req.body);
    res.status(500).json({status: false, message: 'Error'});
  }
}

async function deleteCoin(req, res) {
  try {
    const id = req.params.id;
    console.log('id = ', id);
    await CoinModel.deleteOne({id: id});
    res.status(200).json({status: true});
  } catch (e) {
    res.status(500).json({status: false, message: e});
  }
}

module.exports.coinRoot = coinRoot;
module.exports.addCoin = addCoin;
module.exports.deleteCoin = deleteCoin;
