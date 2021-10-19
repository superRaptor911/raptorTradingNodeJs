const TransactionModel = require('../models/TransactionModel');
const {sellCoin, buyCoin} = require('./transactions/trans');

async function addTransaction(req, res) {
  try {
    const {username, transType, coin, coinCount, price, fee, time} = req.body;
    if (transType === 'SELL') {
      await sellCoin(username, coin, coinCount, price, fee );
    } else {
      await buyCoin(username, coin, coinCount, price, fee );
    }

    const newTrans = new TransactionModel();
    newTrans.username = username;
    newTrans.transType = transType;
    newTrans.coin = coin;
    newTrans.coinCount = coinCount;
    newTrans.fee = fee;
    newTrans.time = time;
    await newTrans.save();
    res.status(200).json({status: true});
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
    res.status(200).json({status: true, data: trans});
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
