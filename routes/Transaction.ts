import {Router} from 'express';
import {
  addTransaction,
  deleteTransaction,
  listAllTransactions,
  listUserTrans,
} from '../controller/Transactions';

const TransactionRouter = Router();

TransactionRouter.get('/', listAllTransactions);
TransactionRouter.post('/add', addTransaction);
TransactionRouter.delete('/:id', deleteTransaction);
TransactionRouter.get('/list/:id', listUserTrans);

export default TransactionRouter;
