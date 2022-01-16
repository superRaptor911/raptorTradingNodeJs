const {sleep} = require('../Utility');
const {execStopLoss} = require('./stopLoss/stopLossBot');

async function execBots() {
  while (true) {
    await execStopLoss();
    await sleep(120000);
  }
}

module.exports.execBots = execBots;
