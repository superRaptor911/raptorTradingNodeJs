const FundTransferModel = require('../models/FundTransferModel');
const {depositFund, withdrawFund} = require('./fund/fund');

async function transferFund(req, res) {
  try {
    const {username, transType, amount, fee, donation, time} = req.body;

    if (transType === 'DEPOSIT') {
      await depositFund(username, amount, fee);
    } else {
      await withdrawFund(username, amount, fee);
    }

    const doc = new FundTransferModel();
    doc.username = username;
    doc.transType = transType;
    doc.amount = amount;
    doc.fee = fee;
    doc.donation = donation;
    doc.time = time;
    await doc.save();
    res.status(200).json({status: true});
  } catch (e) {
    console.error('FundTransfer::transferFund', e);
    res.status(500).json({status: false, message: e});
  }
}

async function deleteFundTransfer(req, res) {
  try {
    const id = req.params.id;
    await FundTransferModel.deleteOne({_id: id});
    res.status(200).json({status: true});
  } catch (e) {
    res.status(500).json({status: false, message: e});
  }
}

async function listAll(_req, res) {
  try {
    const transfers = await FundTransferModel.find({});
    res.status(200).json({status: true, data: transfers});
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

async function listUserTransfer(req, res) {
  try {
    const username = req.params.id;
    const transfers = await FundTransferModel.findOne({username: username});
    res.status(200).json({status: true, data: transfers});
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

module.exports.transferFund = transferFund;
module.exports.deleteFundTransfer = deleteFundTransfer;
module.exports.listAll = listAll;
module.exports.listUserTransfer = listUserTransfer;
