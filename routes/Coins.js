const {
  coinRoot,
  addCoin,
  deleteCoin,
  coinPrice,
} = require('../controller/Coins');
const router = require('express').Router();

router.get('/', coinRoot);
router.post('/add', addCoin);
router.delete('/delete/:id', deleteCoin);
router.get('/prices', coinPrice);

module.exports.CoinRouter = router;
