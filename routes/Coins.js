const {coinRoot, addCoin, deleteCoin} = require('../controller/Coins');
const router = require('express').Router();

router.get('/', coinRoot);
router.post('/add', addCoin);
router.delete('/delete/:id', deleteCoin);

module.exports.CoinRouter = router;
