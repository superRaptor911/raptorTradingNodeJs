const StopLossModel = require('../../models/bots/StopLossModel');
const {testCoinPrice} = require('../../tests/api');

async function execStopLoss() {
  const customers = await StopLossModel.find({isEnabled: true});
  const coinPrices = await testCoinPrice();

  if (!coinPrices) {
    return;
  }

  for (const i of customers) {
    for (const coin of i.rules) {
      const price = coinPrices[coin.coinId].last;
    }
  }
}

module.exports.execStopLoss = execStopLoss;
