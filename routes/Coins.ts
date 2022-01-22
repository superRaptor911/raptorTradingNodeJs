import {Router} from 'express';
import {coinRoot, addCoin, deleteCoin, coinPrice} from '../controller/Coins';

const router = Router();

router.get('/', coinRoot);
router.post('/add', addCoin);
router.delete('/delete/:id', deleteCoin);
router.get('/prices', coinPrice);

module.exports.CoinRouter = router;
