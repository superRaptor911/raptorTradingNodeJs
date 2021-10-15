/* eslint-disable no-throw-literal */

const UserModel = require('../../models/UserModel');

async function depositFund(username, amount, fee) {
  try {
    const user = await UserModel.findOne({name: username});
    user.wallet.balance += amount - fee;
    user.wallet.investment += amount;
    await user.save();
  } catch (e) {
    console.error('FundTransfer::depositFund ', e);
    throw e;
  }
}

async function withdrawFund(username, amount, fee) {
  try {
    const user = await UserModel.findOne({name: username});
    const balance = user.wallet.balance - amount;

    if (balance < 0) {
      throw 'Low balance';
    }
    user.wallet.balance = balance;
    user.wallet.investment -= amount - fee;
    await user.save();
  } catch (e) {
    console.error('FundTransfer::withdrawFund ', e);
    throw e;
  }
}

module.exports.depositFund = depositFund;
module.exports.withdrawFund = withdrawFund;
