/* eslint-disable no-throw-literal */
const UserModel = require('../../models/UserModel');

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

    if (user.wallet.coins && user.wallet.coins[coinId] >= coinCount) {
      user.wallet.coins[coinId] -= coinCount;
      user.wallet.balance = balance - fee;
      console.log('user wallet ', user.wallet);
    } else {
      throw 'INSUFFICIENT COINS';
    }

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
