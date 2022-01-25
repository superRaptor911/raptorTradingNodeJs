/* eslint-disable no-throw-literal */
import {TransactionModel} from '../../models/TransactionModel';
import {User, UserModel} from '../../models/UserModel';
import {LockedAssetModel} from '../../models/wazirx/LockedAssetModel';
import {
  WazirxTransaction,
  WazirxTransactionModel,
} from '../../models/wazirx/WazirxTransactionModel';
import {sleep} from '../../Utility';
import {wazirxOrderLimit, wazirxGetOrderInfo} from '../../wazirx/api';
import {sellCoin, buyCoin} from '../transactions/trans';

// Function to check balance before transaction
function checkBalance(balance: number, sum: number) {
  const newBalance = balance - sum;
  if (newBalance < 0) {
    throw 'INSUFFICIENT BALANCE';
  }
}

// Lock balance till wazirx completes transaction
async function lockBalance(user: User, amount: number, orderId: string) {
  user.wallet.balance -= amount;
  const lockedAsset = new LockedAssetModel();
  lockedAsset.username = user.name;
  lockedAsset.id = orderId;
  lockedAsset.asset = 'balance';
  lockedAsset.amount = amount;
  await lockedAsset.save();
  user.markModified('wallet');
  await user.save();
}

async function lockAsset(
  user: User,
  asset: string,
  amount: number,
  orderId: string,
) {
  if (user.wallet.coins && user.wallet.coins[asset]) {
    user.wallet.coins[asset] -= amount;
    const lockedAsset = new LockedAssetModel();
    lockedAsset.username = user.name;
    lockedAsset.id = orderId;
    lockedAsset.asset = asset;
    lockedAsset.amount = amount;
    await lockedAsset.save();
    user.markModified('wallet');
    await user.save();
  }
}

// Function save wazirx transaction
async function saveWazirxTransaction(
  username: string,
  orderId: string,
  receipt: any,
  remarks: string,
) {
  const wazirxTransaction = new WazirxTransactionModel();
  wazirxTransaction.username = username;
  wazirxTransaction.id = orderId;
  wazirxTransaction.status = 'PENDING';
  wazirxTransaction.receipt = receipt;
  wazirxTransaction.remarks = remarks;
  await wazirxTransaction.save();
}

// funtion to place buy order in wazirx
export async function wazirxPlaceBuyOrder(
  username: string,
  coinId: string,
  coinCount: number,
  price: number,
  remarks = 'Placed By User',
) {
  try {
    const user = await UserModel.findOne({name: username});
    if (user) {
      const balance = user.wallet.balance;
      const amount = coinCount * price;
      checkBalance(balance, amount);

      // Place order
      const result: any = await wazirxOrderLimit(
        coinId,
        coinCount,
        price,
        'buy',
      );
      if (!result || !result.id) {
        throw 'Failed to place order';
      }

      const orderId = result.id;
      await lockBalance(user, amount, orderId);

      // Save transaction receipt
      saveWazirxTransaction(username, orderId, result, remarks);
      return orderId;
    }
    return null;
  } catch (e) {
    /* handle error */
    console.error('trans::placeBuyOrder ', e);
    throw e;
  }
}

export async function wazirxPlaceSellOrder(
  username: string,
  coinId: string,
  coinCount: number,
  price: number,
  remarks = 'Placed By User',
) {
  try {
    const user = await UserModel.findOne({name: username});
    if (user) {
      // check if transaction feasible
      if (!(user.wallet.coins && user.wallet.coins[coinId] >= coinCount)) {
        throw 'INSUFFICIENT COINS';
      }
      // Place order
      const result: any = await wazirxOrderLimit(
        coinId,
        coinCount,
        price,
        'sell',
      );

      if (!result || !result.id) {
        throw 'Failed to place order';
      }
      const orderId = result.id;
      // Lock coin till wazirx completes transaction
      lockAsset(user, coinId, coinCount, orderId);
      // Save transaction receipt
      saveWazirxTransaction(username, orderId, result, remarks);
      return orderId;
    }
    return null;
  } catch (e) {
    /* handle error */
    console.error('trans::placeSellOrder ', e);
    throw e;
  }
}

async function unlockLockedAsset(orderId: string, coinId: string) {
  const asset = await LockedAssetModel.findOne({id: orderId});
  const user = await UserModel.findOne({name: asset?.username});
  if (user && asset) {
    if (asset.asset === 'balance') {
      user.wallet.balance += asset.amount;
    } else {
      if (user.wallet.coins && user.wallet.coins[coinId]) {
        user.wallet.coins[coinId] += asset.amount;
      }
    }

    user.markModified('wallet');
    await user.save();
    await asset.delete();
  } else {
    throw 'Failed to unlock asset';
  }
}

// Function to execute completed transaction
async function executeTransaction(
  receipt: any,
  transaction: WazirxTransaction,
) {
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
async function cancelTransaction(receipt: any, transaction: WazirxTransaction) {
  const coinId = receipt.symbol;
  const qty = parseFloat(receipt.executedQty);

  if (qty > 0) {
    // Execute if executed
    await executeTransaction(receipt, transaction);
  } else {
    // Unlock Locked asset
    await unlockLockedAsset(transaction.id, coinId);
  }
}

export async function wazirxTransChecker() {
  while (true) {
    await sleep(1000);
    // Get Pending Transactions
    const remaining = await WazirxTransactionModel.find({status: 'PENDING'});
    remaining.length > 0 &&
      console.log(`Processing ${remaining.length} transactions`);

    // Process pending transactions
    for (const i of remaining) {
      // Get Transaction receipt from wazirx
      const receipt: any = await wazirxGetOrderInfo(i.id);
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
