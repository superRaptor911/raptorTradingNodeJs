import {
  wazirxPlaceSellOrder,
  wazirxPlaceBuyOrder,
} from '../../controller/wazirx/trans';
import {StopLoss, StopLossModel} from '../../models/bots/StopLossModel';
import {UserModel} from '../../models/UserModel';
import {getRequest, sendMail} from '../../Utility';
import {wazirxGetOrderInfo, wazirxCancelOrder} from '../../wazirx/api';

const server = 'https://raptor-trading.herokuapp.com';

async function coinPrice() {
  try {
    const data: any = await getRequest(server + '/coins/prices');
    return data.data;
  } catch (e) {
    console.error('coinTest::coinPrice ', e);
  }
}

async function useAvailableCoins(
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
    const coinCount = await useAvailableCoins(username, coinId, count);
    const coinPrices = await coinPrice();
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
    const coinPrices = await coinPrice();
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
  const user = await UserModel.findOne({name: rule.username});
  user &&
    (await sendMail(
      user.email,
      'Stop Loss Bot Order Success',
      'Stop Loss Bot successfully executed ' +
        `${rule.transType} ${rule.count} ${rule.coinId} at ${rule.price}`,
    ));
}

const checkCondition = (rule: StopLoss, price: number) => {
  if (rule.condition === 'LESS') {
    return price < rule.price;
  } else if (rule.condition === 'GREATER') {
    return price > rule.price;
  }
  return false;
};

export async function execStopLoss() {
  const rules = await StopLossModel.find({isEnabled: true});
  let coinPrices = await coinPrice();

  if (!coinPrices) return;

  for (const i of rules) {
    coinPrices = await coinPrice();
    const price = coinPrices[i.coinId].last;

    // Check if order placed or not
    if (!i.orderId) {
      if (i.transType === 'SELL' && checkCondition(i, price)) {
        // Place sell order
        const orderId = await stopLossSell(i.username, i.coinId, i.count);
        i.orderId = orderId;
        await i.save();
      } else if (i.transType === 'BUY' && checkCondition(i, price)) {
        // Place buy order
        const orderId = await stopLossBuy(i.username, i.coinId, i.count);
        i.orderId = orderId;
        await i.save();
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
        console.log('Order Failed, retrying...');
        i.orderId = null;
        await i.save();
      } else {
        console.log('Order did not complete. canceling ...');
        await wazirxCancelOrder(i.coinId, i.orderId);
      }
    }
  }
}
