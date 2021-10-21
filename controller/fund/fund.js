/* eslint-disable no-throw-literal */

const DonationModel = require('../../models/DonationModel');
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

async function withdrawFund(username, amount, fee, force) {
  try {
    const user = await UserModel.findOne({name: username});
    const balance = user.wallet.balance - amount;

    if (!force && balance < 0) {
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

async function addDonation(username, amount, id) {
  if (amount > 0) {
    try {
      const user = await UserModel.findOne({name: username});
      user.wallet.balance -= amount;
      await user.save();

      const doc = new DonationModel();
      doc.username = username;
      doc.amount = amount;
      doc.transId = id;
      await doc.save();
    } catch (e) {
      /* handle error */
      console.error('fund::addDonation', e);
      throw e;
    }
  }
}

module.exports.depositFund = depositFund;
module.exports.withdrawFund = withdrawFund;
module.exports.addDonation = addDonation;
