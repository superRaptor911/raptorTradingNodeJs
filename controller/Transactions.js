const TransactionModel = require('../models/TransactionModel');
const {checkRequired} = require('../Utility');
const {sellCoin, buyCoin} = require('./transactions/trans');

async function addTransaction(req, res) {
  try {
    checkRequired(req.body, [
      'username',
      'transType',
      'coinId',
      'coinCount',
      'price',
      'fee',
    ]);
    let {
      username,
      transType,
      coin: coinId,
      coinCount,
      price,
      fee,
      time,
      force,
    } = req.body;

    coinCount = parseFloat(coinCount);
    price = parseFloat(price);
    fee = parseFloat(fee);

    if (transType === 'SELL') {
      await sellCoin(username, coinId, coinCount, price, fee);
    } else {
      await buyCoin(username, coinId, coinCount, price, fee, force);
    }

    const newTrans = new TransactionModel();
    newTrans.username = username;
    newTrans.transType = transType;
    newTrans.coinId = coinId;
    newTrans.coinCount = coinCount;
    newTrans.fee = fee;
    newTrans.time = time;
    newTrans.cost = price;
    await newTrans.save();
    res.status(200).json({status: true, message: 'Success'});
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

async function deleteTransaction(req, res) {
  try {
    const id = req.params.id;
    await TransactionModel.deleteOne({_id: id});
    res.status(200).json({status: true});
  } catch (e) {
    res.status(500).json({status: false, message: e});
  }
}

async function listAll(_req, res) {
  try {
    const trans = await TransactionModel.find({});
    res.status(200).json({status: true, data: trans.reverse()});
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

async function listUserTrans(req, res) {
  try {
    const username = req.params.id;
    const trans = await TransactionModel.findOne({username: username});
    res.status(200).json({status: true, data: trans});
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}
module.exports.addTransaction = addTransaction;
module.exports.deleteTransaction = deleteTransaction;
module.exports.listAllTransactions = listAll;
module.exports.listUserTrans = listUserTrans;
