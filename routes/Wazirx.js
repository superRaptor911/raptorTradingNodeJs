const {
  stopLossAddRule,
  stopLossEditRule,
  stopLossListRules,
  stopLossDeleteRule,
} = require('../controller/wazirx/StopLossBot');
const {
  wazirxPlaceTransaction,
  wazirxStopOrder,
  wazirxCheckOrderStatus,
  wazirxGetTransactionList,
} = require('../controller/wazirx/WazirxTransaction');

const router = require('express').Router();

router.post('/add', wazirxPlaceTransaction);
router.post('/cancel', wazirxStopOrder);
router.post('/status', wazirxCheckOrderStatus);
router.post('/list', wazirxGetTransactionList);
router.post('/stoplossbotaddrule', stopLossAddRule);
router.post('/stoplossboteditrule', stopLossEditRule);
router.post('/stoplossbotlistrules', stopLossListRules);
router.post('/stoplossbotdeleterule', stopLossDeleteRule);

module.exports.WazirxRouter = router;
