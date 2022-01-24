import {Router} from 'express';
import {
  transferFund,
  deleteFundTransfer,
  listAll,
  listUserTransfer,
} from '../controller/FundTransfer';

const FundTransferRouter = Router();

FundTransferRouter.post('/transfer', transferFund);
FundTransferRouter.get('/list', listAll);
FundTransferRouter.get('/list/:id', listUserTransfer);
FundTransferRouter.delete('/:id', deleteFundTransfer);

export default FundTransferRouter;
