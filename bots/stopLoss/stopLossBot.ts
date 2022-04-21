import {StopLoss, StopLossModel} from '../../models/bots/StopLossModel';
import {UserModel} from '../../models/UserModel';
import {sendMail} from '../../Utility';
import {wazirxGetOrderInfo, wazirxCancelOrder} from '../../wazirx/api';
import {
  wazirxPlaceSellOrder,
  wazirxPlaceBuyOrder,
} from '../../wazirx/transactions';
import {api_getCoinPrices} from '../helper';

async function getAvailableCoins(
  username: string,
  coinId: string,
  count: number,
) {
  const user = await UserModel.findOne({name: username});
  if (user) {
    const coins = user.wallet.coins;
    if (coins && coins[coinId]) {
      const coinCount = coins[coinId];
      return Math.min(coinCount, count);
    }
  }
  return 0;
}

async function getUserBalance(username: string) {
  const user = await UserModel.findOne({name: username});
  if (user) {
    const inrBalance = user.wallet.balance;
    return inrBalance;
  }
  return 0;
}

async function stopLossSell(username: string, coinId: string, count: number) {
  try {
    const coinCount = await getAvailableCoins(username, coinId, count);
    const coinPrices = await api_getCoinPrices();
    const price = coinPrices[coinId].buy;

    const orderId = await wazirxPlaceSellOrder(
      username,
      coinId,
      coinCount,
      price,
      'Placed By Stop Loss Bot',
    );
    console.log(
      `Placing stop loss sell order for ${username} on ${coinCount} ${coinId}`,
    );
    console.log('Order id ', orderId);
    return orderId;
  } catch (e) {
    /* handle error */
    console.error('stopLossBot::Error', e);
  }
}

async function stopLossBuy(username: string, coinId: string, count: number) {
  try {
    const balance = await getUserBalance(username);
    if (balance < 50) {
      console.log('Low Balance.. not placing order');
      return;
    }
    const coinPrices = await api_getCoinPrices();
    const price = coinPrices[coinId].sell;
    const coinCount = Math.min(count, balance / price);
    const orderId = await wazirxPlaceBuyOrder(
      username,
      coinId,
      coinCount,
      price,
      'Placed By  StopLossBot',
    );

    console.log(
      `Placing stop loss buy order for ${username} on ${coinCount} ${coinId}`,
    );
    console.log('Order id ', orderId);
    return orderId;
  } catch (e) {
    /* handle error */
    console.error('stopLossBot::Error', e);
  }
}

async function sendSuccessMail(rule: StopLoss) {
  try {
    const user = await UserModel.findOne({name: rule.username});
    user &&
      (await sendMail(
        user.email,
        'Stop Loss Bot Order Success',
        'Stop Loss Bot successfully executed ' +
          `${rule.transType} ${rule.count} ${rule.coinId} at ${rule.price}`,
      ));
  } catch (e) {
    /* handle error */
    console.error('stopLossBot::Failed To send Mail', e);
  }
}

async function sendPartialSuccessMail(rule: StopLoss, qty: number) {
  try {
    const user = await UserModel.findOne({name: rule.username});
    user &&
      (await sendMail(
        user.email,
        'Stop Loss Bot Order Partially Success',
        'Stop Loss Bot successfully executed ' +
          `${rule.transType} ${qty}/${rule.count} ${rule.coinId} at ${rule.price}`,
      ));
  } catch (e) {
    /* handle error */
    console.error('stopLossBot::Failed To send Mail', e);
  }
}

const checkCondition = (rule: StopLoss, price: number) => {
  if (rule.condition === 'LESS') {
    return price < rule.price;
  } else if (rule.condition === 'GREATER') {
    return price > rule.price;
  }
  return false;
};

async function updateRule(rule: StopLoss, orderId: string) {
  if (orderId) {
    rule.orderId = orderId;
    await rule.save();
  } else {
    if (rule.transType == 'BUY') {
      console.error('stopLossBot::execStopLoss failed to place stopLossBuy');
    } else {
      console.error('stopLossBot::execStopLoss failed to place stopLossSell');
    }
  }
}

export async function execStopLoss() {
  const rules = await StopLossModel.find({isEnabled: true});
  let coinPrices = await api_getCoinPrices();

  if (!coinPrices) return;

  for (const i of rules) {
    coinPrices = await api_getCoinPrices();
    const sellPrice = coinPrices[i.coinId].buy;
    const buyPrice = coinPrices[i.coinId].sell;

    // Check if order placed or not
    if (!i.orderId) {
      // Place sell order
      if (i.transType === 'SELL' && checkCondition(i, sellPrice)) {
        const orderId = await stopLossSell(i.username, i.coinId, i.count);
        await updateRule(i, orderId);
      } else if (i.transType === 'BUY' && checkCondition(i, buyPrice)) {
        // Place buy order
        const orderId = await stopLossBuy(i.username, i.coinId, i.count);
        await updateRule(i, orderId);
      }
    } else {
      // Get Transaction receipt from wazirx
      const receipt: any = await wazirxGetOrderInfo(i.orderId);

      if (receipt.status === 'done') {
        i.orderId = null;
        i.isEnabled = false;
        await i.save();
        await sendSuccessMail(i);
      } else if (receipt.status === 'cancel') {
        console.log('order did not complete');
        // Check if partially done
        if (receipt.executedQty > 0) {
          console.log('partially completed order');
          i.isEnabled = false; // disable rule
          await sendPartialSuccessMail(i, receipt.executedQty);
        }
        i.orderId = null;
        await i.save();
      } else {
        console.log('Order did not complete. Canceling ...');
        await wazirxCancelOrder(i.coinId, i.orderId);
      }
    }
  }
}
