const StopLossModel = require('../../models/bots/StopLossModel');

async function execStopLoss() {
  const customers = await StopLossModel.find({isEnabled: true});

  for (const i of customers) {
    for (const coin of i.rules) {
    }
  }
}
