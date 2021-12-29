/* eslint-disable no-throw-literal */
const WazirxTransactionModel = require('../../models/wazirx/WazirxTransactionModel');
const {checkRequired} = require('../../Utility');
const {wazirxGetOrderInfo, wazirxCancelOrder} = require('../../wazirx/api');
const {wazirxPlaceSellOrder, wazirxPlaceBuyOrder} = require('./trans');

async function wazirxPlaceTransaction(req, res) {
  try {
    checkRequired(req.body, [
      'username',
      'transType',
      'coin',
      'coinCount',
      'price',
    ]);
    let {username, transType, coin, coinCount, price} = req.body;

    coinCount = parseFloat(coinCount);
    price = parseFloat(price);

    let orderId = '0';
    if (transType === 'SELL') {
      orderId = await wazirxPlaceSellOrder(username, coin, coinCount, price);
    } else {
      orderId = await wazirxPlaceBuyOrder(username, coin, coinCount, price);
    }
    res.status(200).json({
      status: true,
      orderId: orderId,
      message: 'Successfully Placed order ' + orderId,
    });
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

async function wazirxCheckOrderStatus(req, res) {
  try {
    checkRequired(req.body, ['username', 'orderId']);
    const {username, orderId} = req.body;

    console.log(username);
    const result = await wazirxGetOrderInfo(orderId);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

async function wazirxStopOrder(req, res) {
  try {
    checkRequired(req.body, ['username', 'orderId', 'coinId']);
    const {username, orderId, coinId} = req.body;

    const order = await WazirxTransactionModel.findOne({
      username: username,
      id: orderId,
    });

    if (!order) {
      throw `Order ${orderId} not found for user ${username}`;
    }

    if (order.status !== 'PENDING') {
      throw `Order ${orderId} was already cancelled`;
    }

    const result = await wazirxCancelOrder(coinId, orderId);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

module.exports.wazirxPlaceTransaction = wazirxPlaceTransaction;
module.exports.wazirxCheckOrderStatus = wazirxCheckOrderStatus;
module.exports.wazirxStopOrder = wazirxStopOrder;
