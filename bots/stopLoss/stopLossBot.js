const StopLossModel = require('../../models/bots/StopLossModel');
const UserModel = require('../../models/UserModel');
const {testCoinPrice} = require('../../tests/api');

async function useAvailableCoins(username, coinId, count) {
  const user = await UserModel.find({name: username});
  const coins = user.wallet.coins;
  const coinCount = coins && coins[coinId];
  return Math.min(coinCount, count);
}

async function stopLossSell(username, coinId, count) {
  try {
    const fixedCount = await useAvailableCoins(username, coinId, count);
  } catch (e) {
    /* handle error */
  }
}

async function execStopLoss() {
  const customers = await StopLossModel.find({isEnabled: true});
  let coinPrices = await testCoinPrice();

  if (!coinPrices) {
    return;
  }

  for (const i of customers) {
    coinPrices = await testCoinPrice();
    for (const rule of i.rules) {
      if (rule.isEnabled) {
        const price = coinPrices[rule.coinId].last;

        if (rule.transType === 'SELL') {
          if (price < rule.price) {
            // Place sell order
          }
        } else {
          if (price > rule.price) {
            // Place buy order
          }
        }
      }
    }
  }
}

module.exports.execStopLoss = execStopLoss;
