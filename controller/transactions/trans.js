const UserModel = require('../../models/UserModel');

async function buyCoin(username, coin, coinCount, price, fee) {
  try {
    const user = await UserModel.findOne({name: username});
    let balance = user.wallet.balance; 
    balance -= coinCount * price  + fee;
    if (balance < 0) {
      throw 'INSUFFICIENT BALANCE';
    }

    user.wallet.balance = balance;
    if (user.wallet.coins[coin]) {
      user.wallet.coins[coin].count += coinCount;
    } else {
      user.wallet.coins[coin] = {count: coinCount};
    }
    await user.save();
  } catch (e) {
    /* handle error */
    console.error('trans::buyCoin ', e);
    throw e;
  }
}

async function sellCoin(username, coin, coinCount, price, fee) {
  try {
    const user = await UserModel.findOne({name: username});

    let balance = user.wallet.balance; 
    balance += coinCount * price  - fee;

    if (user.wallet.coins[coin] && user.wallet.coins[coin].count > coinCount) {
      user.wallet.coins[coin].count -= coinCount;
    } else {
      throw 'INSUFFICIENT COINS';
    }

    user.wallet.balance = balance;
    user.wallet.coins[coin].count -= coinCount;
    await user.save();
  } catch (e) {
    /* handle error */
    console.error('trans::buyCoin ', e);
    throw e;
  }
}

module.exports.buyCoin = buyCoin;
module.exports.sellCoin = sellCoin;
