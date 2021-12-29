/* eslint-disable no-throw-literal */
const CoinModel = require('../../models/CoinModel');
const UserModel = require('../../models/UserModel');
const LokedAssetModel = require('../../models/wazirx/LockedAssetModel');
const WazirxTransactionModel = require('../../models/wazirx/WazirxTransactionModel');
const {wazirxOrderLimit} = require('../../wazirx/api');

async function placeBuyOrder(username, coin, coinCount, price) {
  try {
    const user = await UserModel.findOne({name: username});
    const coinObj = await CoinModel.findOne({name: coin});
    const coinId = coinObj.id;

    // check if transaction feasible
    let balance = user.wallet.balance;
    balance -= coinCount * price;
    if (balance < 0) {
      throw 'INSUFFICIENT BALANCE';
    }

    // Place order
    const result = await wazirxOrderLimit(coinId, coinCount, price, 'buy');
    if (!result.id) {
      throw 'Failed to place order';
    }

    const orderId = result.id;
    user.wallet.balance = balance;

    // Lock balance till wazirx completes transaction
    const lockedAsset = new LokedAssetModel();
    lockedAsset.username = username;
    lockedAsset.id = orderId;
    lockedAsset.asset = 'balance';
    lockedAsset.amount = coinCount * price;
    await lockedAsset.save();

    // Save transaction receipt
    const wazirxTransaction = new WazirxTransactionModel();
    wazirxTransaction.username = username;
    wazirxTransaction.id = orderId;
    wazirxTransaction.status = 'PENDING';
    wazirxTransaction.receipt = result;
    await wazirxTransaction.save();

    user.markModified('wallet');
    await user.save();
    return orderId;
  } catch (e) {
    /* handle error */
    console.error('trans::placeBuyOrder ', e);
    throw e;
  }
}

async function placeSellOrder(username, coin, coinCount, price) {
  try {
    const user = await UserModel.findOne({name: username});
    // check if transaction feasible
    if (
      !(
        user.wallet.coins &&
        user.wallet.coins[coin] &&
        user.wallet.coins[coin].count >= coinCount
      )
    ) {
      throw 'INSUFFICIENT COINS';
    }

    user.wallet.coins[coin].count -= coinCount;
    const coinObj = await CoinModel.findOne({name: coin});
    const coinId = coinObj.id;

    // Place order
    const result = await wazirxOrderLimit(coinId, coinCount, price, 'sell');
    if (!result.id) {
      throw 'Failed to place order';
    }
    const orderId = result.id;

    // Lock coin till wazirx completes transaction
    const lockedAsset = new LokedAssetModel();
    lockedAsset.username = username;
    lockedAsset.id = orderId;
    lockedAsset.asset = coinId;
    lockedAsset.amount = coinCount * price;
    await lockedAsset.save();

    // Save transaction receipt
    const wazirxTransaction = new WazirxTransactionModel();
    wazirxTransaction.username = username;
    wazirxTransaction.id = orderId;
    wazirxTransaction.status = 'PENDING';
    wazirxTransaction.receipt = result;
    await wazirxTransaction.save();

    user.markModified('wallet');
    await user.save();
    return orderId;
  } catch (e) {
    /* handle error */
    console.error('trans::placeSellOrder ', e);
    throw e;
  }
}

module.exports.wazirxPlaceBuyOrder = placeBuyOrder;
module.exports.wazirxPlaceSellOrder = placeSellOrder;
