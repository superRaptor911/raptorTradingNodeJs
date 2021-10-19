const CoinModel = require('../models/CoinModel');
const {default: fetch} = require('node-fetch');
const {coinData2coinPriceList} = require('./coins/utility');

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
    const {name, id, avatar} = req.body;

    const doc = new CoinModel();
    doc.name = name;
    doc.avatar = avatar;
    doc.id = id;
    await doc.save();

    res.status(200).json({status: true, message: 'GG'});
  } catch (e) {
    console.error('Coins::addCoin ', e);
    res.status(500).json({status: false, message: 'Error'});
  }
}

async function deleteCoin(req, res) {
  try {
    const coin = req.params.id;
    await CoinModel.deleteOne({name: coin});
    res.status(200).json({status: true});
  } catch (e) {
    res.status(500).json({status: false, message: e});
  }
}

async function coinPrice(_req, res) {
  try {
    const apiPath = 'https://api.wazirx.com/api/v2/tickers';
    const response = await fetch(apiPath, {
      method: 'GET',
    });
    const coins = await CoinModel.find({});
    const coinData = await response.json();
    const coinPriceList = coinData2coinPriceList(coinData, coins);
    res.status(200).json({status: true, data: coinPriceList});
  } catch (e) {
    res.status(500).json({status: false, message: e});
  }
}

module.exports.coinRoot = coinRoot;
module.exports.addCoin = addCoin;
module.exports.deleteCoin = deleteCoin;
module.exports.coinPrice = coinPrice;
