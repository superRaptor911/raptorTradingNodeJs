const StopLossModel = require('../../models/bots/StopLossModel');
const {checkRequired} = require('../../Utility');

async function stopLossAddRule(req, res) {
  try {
    checkRequired(req.body, [
      'username',
      'isEnabled',
      'coinId',
      'transType',
      'price',
      'count',
    ]);

    const {username, isEnabled, coinId, transType, price, count} = req.body;

    const mdl = new StopLossModel();
    mdl.username = username;
    mdl.isEnabled = isEnabled;
    mdl.coinId = coinId;
    mdl.transType = transType;
    mdl.price = price;
    mdl.count = count;
    mdl.placeTime = new Date();
    await mdl.save();

    res.status(200).json({
      status: true,
      message: 'GG',
    });
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

async function stopLossEditRule(req, res) {
  try {
    checkRequired(req.body, [
      'id',
      'username',
      'isEnabled',
      'coinId',
      'transType',
      'price',
      'count',
    ]);

    const {id, username, isEnabled, coinId, transType, price, count} = req.body;

    const mdl = await StopLossModel.findOne({_id: id});
    mdl.username = username;
    mdl.isEnabled = isEnabled;
    mdl.coinId = coinId;
    mdl.transType = transType;
    mdl.price = price;
    mdl.count = count;
    await mdl.save();

    res.status(200).json({
      status: true,
      message: 'GG',
    });
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

module.exports.stopLossAddRule = stopLossAddRule;
module.exports.stopLossAddRule = stopLossEditRule;
