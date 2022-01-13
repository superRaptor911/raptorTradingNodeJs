/* eslint-disable no-throw-literal */
const UserModel = require('../../models/UserModel');
const {fixedNumber} = require('../../Utility');

async function buyCoin(username, coinId, coinCount, price, fee, force) {
  try {
    const user = await UserModel.findOne({name: username});
    let balance = user.wallet.balance;
    balance -= coinCount * price;
    if (!force && balance < 0) {
      throw 'INSUFFICIENT BALANCE';
    }

    user.wallet.balance = balance - fee;
    if (!user.wallet.coins) {
      user.wallet.coins = {};
    }

    if (user.wallet.coins[coinId]) {
      user.wallet.coins[coinId] += coinCount;
    } else {
      user.wallet.coins[coinId] = coinCount;
    }
    // Remove floating point error
    user.wallet.coins[coinId] = fixedNumber(user.wallet.coins[coinId]);
    user.markModified('wallet');
    await user.save();
  } catch (e) {
    /* handle error */
    console.error('trans::buyCoin ', e);
    throw e;
  }
}

async function sellCoin(username, coinId, coinCount, price, fee) {
  try {
    const user = await UserModel.findOne({name: username});

    let balance = user.wallet.balance;
    balance += coinCount * price;

    // fix any floating point error in coin balance
    const coinBalance = user.wallet.coins
      ? fixedNumber(user.wallet.coins[coinId])
      : 0;

    if (coinBalance >= coinCount) {
      user.wallet.coins[coinId] -= coinCount;
      user.wallet.balance = balance - fee;
    } else {
      throw 'INSUFFICIENT COINS';
    }

    // Remove floating point error
    user.wallet.coins[coinId] = fixedNumber(user.wallet.coins[coinId]);
    user.markModified('wallet');
    await user.save();
  } catch (e) {
    /* handle error */
    console.error('trans::sellCoin ', e);
    throw e;
  }
}

module.exports.buyCoin = buyCoin;
module.exports.sellCoin = sellCoin;
