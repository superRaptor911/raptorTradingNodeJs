import {sellCoin, buyCoin} from '../controller/transactions/trans';
import {TransactionModel} from '../models/TransactionModel';
import {User, UserModel} from '../models/UserModel';
import {LockedAssetModel} from '../models/wazirx/LockedAssetModel';
import {
  WazirxTransactionModel,
  WazirxTransaction,
} from '../models/wazirx/WazirxTransactionModel';

// Function to check balance before transaction
export function checkBalance(balance: number, sum: number) {
  const newBalance = balance - sum;
  if (newBalance < 0) {
    throw 'INSUFFICIENT BALANCE';
  }
}

const FEE = 0.002;
const FEE_TDS = 0.01;

// Lock balance till wazirx completes transaction
export async function lockBalance(user: User, amount: number, orderId: string) {
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

export async function lockAsset(
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
export async function saveWazirxTransaction(
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

export async function unlockLockedAsset(orderId: string, coinId: string) {
  const asset = await LockedAssetModel.findOne({id: orderId});
  const user = await UserModel.findOne({name: asset?.username});
  if (user && asset) {
    if (asset.asset === 'balance') {
      user.wallet.balance += asset.amount;
    } else {
      // Critical Bug fixed here
      if (user.wallet.coins && user.wallet.coins[coinId] !== undefined) {
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
export async function executeTransaction(
  receipt: any,
  transaction: WazirxTransaction,
) {
  const coinId = receipt.symbol;
  // Unlock Locked asset
  await unlockLockedAsset(transaction.id, coinId);
  const totalFee = receipt.side === 'buy' ? FEE : FEE + FEE_TDS;
  const fee = receipt.price * receipt.executedQty * totalFee;

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
export async function cancelTransaction(
  receipt: any,
  transaction: WazirxTransaction,
) {
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
