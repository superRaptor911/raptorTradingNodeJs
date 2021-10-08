const {coinRoot, addCoin} = require('../controller/Coins');
const router = require('express').Router();

router.get('/', coinRoot);
router.post('/add', addCoin);

module.exports.CoinRouter = router;
