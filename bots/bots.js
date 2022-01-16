const {sleep} = require('../Utility');
const {execStopLoss} = require('./stopLoss/stopLossBot');

async function execBots() {
  while (true) {
    await execStopLoss();
    await sleep(60000);
  }
}

module.exports.execBots = execBots;
