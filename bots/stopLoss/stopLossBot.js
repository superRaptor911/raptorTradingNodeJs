const {
  wazirxPlaceSellOrder,
  wazirxPlaceBuyOrder,
} = require('../../controller/wazirx/trans');
const StopLossModel = require('../../models/bots/StopLossModel');
const UserModel = require('../../models/UserModel');
const {testCoinPrice} = require('../../tests/api');
const {sendMail} = require('../../Utility');
const {wazirxGetOrderInfo, wazirxCancelOrder} = require('../../wazirx/api');

async function useAvailableCoins(username, coinId, count) {
  const user = await UserModel.findOne({name: username});
  const coins = user.wallet.coins;
  const coinCount = coins && coins[coinId];
  return Math.min(coinCount, count);
}

async function getUserBalance(username) {
  const user = await UserModel.findOne({name: username});
  const inrBalance = user.wallet.balance;
  return inrBalance;
}

async function stopLossSell(username, coinId, count) {
  try {
    const coinCount = await useAvailableCoins(username, coinId, count);
    const coinPrices = await testCoinPrice();
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

async function stopLossBuy(username, coinId, count) {
  try {
    const balance = await getUserBalance(username);
    if (balance < 50) {
      console.log('Low Balance.. not placing order');
      return;
    }
    const coinPrices = await testCoinPrice();
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

async function sendSuccessMail(rule) {
  const user = await UserModel.findOne({name: rule.username});
  await sendMail(
    user.email,
    'Stop Loss Bot Order Success',
    'Stop Loss Bot successfully executed ' +
      `${rule.transType} ${rule.count} ${rule.coinId} at ${rule.price}`,
  );
}

const checkCondition = (rule, price) => {
  if (rule.condition === 'LESS') {
    return price < rule.price;
  } else if (rule.condition === 'GREATER') {
    return price > rule.price;
  }
  return false;
};

async function execStopLoss() {
  const rules = await StopLossModel.find({isEnabled: true});
  let coinPrices = await testCoinPrice();

  if (!coinPrices) return;

  for (const i of rules) {
    coinPrices = await testCoinPrice();
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
      const receipt = await wazirxGetOrderInfo(i.orderId);

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

module.exports.execStopLoss = execStopLoss;
