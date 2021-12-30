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

module.exports.WazirxRouter = router;
