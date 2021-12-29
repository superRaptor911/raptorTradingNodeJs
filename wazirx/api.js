const {wazirxGetRequest} = require('./request');

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

module.exports.wazirxGetOrderInfo = wazirxGetOrderInfo;
