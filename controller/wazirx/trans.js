/* eslint-disable no-throw-literal */
const TransactionModel = require('../../models/TransactionModel');
const UserModel = require('../../models/UserModel');
const LockedAssetModel = require('../../models/wazirx/LockedAssetModel');
const WazirxTransactionModel = require('../../models/wazirx/WazirxTransactionModel');
const {sleep} = require('../../Utility');
const {wazirxOrderLimit, wazirxGetOrderInfo} = require('../../wazirx/api');
const {sellCoin, buyCoin} = require('../transactions/trans');

async function placeBuyOrder(username, coinId, coinCount, price) {
  try {
    const user = await UserModel.findOne({name: username});

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
    const lockedAsset = new LockedAssetModel();
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

async function placeSellOrder(username, coinId, coinCount, price) {
  try {
    const user = await UserModel.findOne({name: username});
    // check if transaction feasible
    if (!(user.wallet.coins && user.wallet.coins[coinId] >= coinCount)) {
      throw 'INSUFFICIENT COINS';
    }

    user.wallet.coins[coinId] -= coinCount;

    // Place order
    const result = await wazirxOrderLimit(coinId, coinCount, price, 'sell');
    if (!result.id) {
      throw 'Failed to place order';
    }
    const orderId = result.id;

    // Lock coin till wazirx completes transaction
    const lockedAsset = new LockedAssetModel();
    lockedAsset.username = username;
    lockedAsset.id = orderId;
    lockedAsset.asset = coinId;
    lockedAsset.amount = coinCount;
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

async function unlockLockedAsset(assetId, coinId) {
  const asset = await LockedAssetModel.findOne({id: assetId});
  const user = await UserModel.findOne({name: asset.username});
  if (asset.asset === 'balance') {
    user.wallet.balance += parseFloat(asset.amount);
  } else {
    user.wallet.coins[coinId] += parseFloat(asset.amount);
  }

  user.markModified('wallet');
  await user.save();
  await asset.delete();
}

// Function to execute completed transaction
async function executeTransaction(receipt, transaction) {
  const coinId = receipt.symbol;
  // Unlock Locked asset
  await unlockLockedAsset(transaction.id, coinId);
  const fee = receipt.price * receipt.executedQty * 0.002;

  // Raptor Trading Transsaction
  const newTrans = new TransactionModel();
  newTrans.username = transaction.username;
  newTrans.coinId = coinId;
  newTrans.coinCount = parseFloat(receipt.executedQty);
  newTrans.fee = fee;
  newTrans.time = new Date();
  newTrans.cost = parseFloat(receipt.price);

  if (receipt.side === 'sell') {
    // Handle Sell
    await sellCoin(
      transaction.username,
      coinId,
      parseFloat(receipt.executedQty),
      parseFloat(receipt.price),
      fee,
    );
    newTrans.transType = 'SELL';
  } else {
    // Handle Buy
    await buyCoin(
      transaction.username,
      coinId,
      parseFloat(receipt.executedQty),
      parseFloat(receipt.price),
      fee,
    );
    newTrans.transType = 'BUY';
  }

  await newTrans.save();
}

// Function to execute completed transaction
async function cancelTransaction(receipt, transaction) {
  const coinId = receipt.symbol;
  // Unlock Locked asset
  await unlockLockedAsset(transaction.id, coinId);
}

async function wazirxTransChecker() {
  while (true) {
    await sleep(1000);
    // Get Pending Transactions
    const remaining = await WazirxTransactionModel.find({status: 'PENDING'});
    console.log(`Processing ${remaining.length} transactions`);

    // Process pending transactions
    for (const i of remaining) {
      // Get Transaction receipt from wazirx
      const receipt = await wazirxGetOrderInfo(i.id);
      if (!receipt) {
        console.error('trans::Failed to get transaction status for ', i.id);
        continue;
      }

      // On success
      if (receipt.status === 'done') {
        await executeTransaction(receipt, i);
        i.status = 'COMPLETED';
      } else if (receipt.status === 'cancel') {
        await cancelTransaction(receipt, i);
        i.status = 'FAILED';
      }

      i.receipt = receipt;
      await i.save();
      await sleep(250);
    }
  }
}

module.exports.wazirxPlaceBuyOrder = placeBuyOrder;
module.exports.wazirxPlaceSellOrder = placeSellOrder;
module.exports.wazirxTransChecker = wazirxTransChecker;
