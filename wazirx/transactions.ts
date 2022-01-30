import {Response} from 'express';
import {TransactionRequest} from '../controller/wazirx/WazirxTransaction';
import {UserModel} from '../models/UserModel';
import {WazirxTransactionModel} from '../models/wazirx/WazirxTransactionModel';
import {sleep} from '../Utility';
import {wazirxOrderLimit, wazirxGetOrderInfo} from './api';
import {
  checkBalance,
  lockBalance,
  saveWazirxTransaction,
  lockAsset,
  executeTransaction,
  cancelTransaction,
} from './helper';

let TransactionQueue: TransactionRequest[] = [];

export function addTraqnsactionToQ(
  username: string,
  transType: string,
  coinId: string,
  coinCount: number,
  price: number,
  res: Response,
) {
  TransactionQueue.push({
    username: username,
    transType: transType,
    coinId: coinId,
    coinCount: coinCount,
    price: price,
    isPlaced: false,
    res: res,
  });
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
      await saveWazirxTransaction(username, orderId, result, remarks);
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
      await lockAsset(user, coinId, coinCount, orderId);
      // Save transaction receipt
      await saveWazirxTransaction(username, orderId, result, remarks);
      return orderId;
    }
    return null;
  } catch (e) {
    /* handle error */
    console.error('trans::placeSellOrder ', e);
    throw e;
  }
}

async function placeOrdersInQueue() {
  TransactionQueue = TransactionQueue.filter(item => !item.isPlaced);

  for (let i of TransactionQueue) {
    try {
      let orderId = '0';
      if (i.transType === 'SELL') {
        orderId = await wazirxPlaceSellOrder(
          i.username,
          i.coinId,
          i.coinCount,
          i.price,
        );
      } else {
        orderId = await wazirxPlaceBuyOrder(
          i.username,
          i.coinId,
          i.coinCount,
          i.price,
        );
      }

      i.res.status(200).json({
        status: true,
        orderId: orderId,
        message: 'Successfully Placed order ' + orderId,
      });
    } catch (e) {
      /* handle error */
      console.error('transactions::placeOrdersInQueue', e);
      i.res.status(500).json({status: false, message: e});
    }
    i.isPlaced = true;
  }
}

export async function wazirxTransChecker() {
  while (true) {
    await sleep(1000);
    await placeOrdersInQueue();

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
