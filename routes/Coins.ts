import {Router} from 'express';
import {coinRoot, addCoin, deleteCoin, coinPrice} from '../controller/Coins';

const CoinRouter = Router();

CoinRouter.get('/', coinRoot);
CoinRouter.post('/add', addCoin);
CoinRouter.delete('/delete/:id', deleteCoin);
CoinRouter.get('/prices', coinPrice);

export default CoinRouter;
