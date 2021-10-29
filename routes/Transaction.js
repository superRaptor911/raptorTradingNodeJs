const {
  addTransaction,
  deleteTransaction,
  listAllTransactions,
  listUserTrans,
} = require('../controller/Transactions');

const router = require('express').Router();

router.get('/', listAllTransactions);
router.post('/add', addTransaction);
router.delete('/:id', deleteTransaction);
router.get('/list/:id', listUserTrans);

module.exports.TransactionRouter = router;
