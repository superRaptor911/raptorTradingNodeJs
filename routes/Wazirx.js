const {
  wazirxPlaceTransaction,
  wazirxStopOrder,
  wazirxCheckOrderStatus,
} = require('../controller/wazirx/WazirxTransaction');

const router = require('express').Router();

router.post('/add', wazirxPlaceTransaction);
router.post('/delete', wazirxStopOrder);
router.get('/status', wazirxCheckOrderStatus);

module.exports.WazirxRouter = router;
