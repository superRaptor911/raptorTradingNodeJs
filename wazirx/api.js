const {
  wazirxGetRequest,
  wazirxDeleteRequest,
  wazirxPostRequest,
} = require('./request');

async function wazirxGetOrderInfo(orderId) {
  try {
    const response = await wazirxGetRequest('/sapi/v1/order', {
      orderId: orderId,
    });
    return response;
  } catch (e) {
    /* handle error */
    console.error('api::wazirxGetOrderInfo', e);
  }
}

async function wazirxGetAllOdersFor(symbol) {
  try {
    const response = await wazirxGetRequest('/sapi/v1/allOrders', {
      symbol: symbol,
    });
    return response;
  } catch (e) {
    /* handle error */
    console.error('api::wazirxGetAllOdersFor', e);
  }
}

async function wazirxCancelOrder(symbol, orderId) {
  try {
    const response = await wazirxDeleteRequest('/sapi/v1/order', {
      symbol: symbol,
      orderId: orderId,
    });
    return response;
  } catch (e) {
    /* handle error */
    console.error('api::wazirxCancelOrder', e);
  }
}

async function wazirxOrderLimit(symbol, quantity, price, side) {
  try {
    const response = await wazirxPostRequest('/sapi/v1/order', {
      symbol: symbol,
      side: side,
      type: 'limit',
      quantity: quantity,
      price: price,
    });
    return response;
  } catch (e) {
    /* handle error */
    console.error('api::wazirxOrderLimit', e);
  }
}

async function wazirxOrderLimitTest(symbol, quantity, price, side) {
  try {
    const response = await wazirxPostRequest('/sapi/v1/order/test', {
      symbol: symbol,
      side: side,
      type: 'limit',
      quantity: quantity,
      price: price,
    });
    return response;
  } catch (e) {
    /* handle error */
    console.error('api::wazirxOrderLimitTest', e);
  }
}

module.exports.wazirxGetOrderInfo = wazirxGetOrderInfo;
module.exports.wazirxGetAllOdersFor = wazirxGetAllOdersFor;
module.exports.wazirxCancelOrder = wazirxCancelOrder;
module.exports.wazirxOrderLimit = wazirxOrderLimit;
module.exports.wazirxOrderLimitTest = wazirxOrderLimitTest;
