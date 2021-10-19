const {addTransaction, deleteTransaction, listAllTransactions, listUserTrans} = require('../controller/Transactions');

const router = require('express').Router();

router.post('/add', addTransaction );
router.delete('/:id', deleteTransaction);
router.get('/list', listAllTransactions);
router.get('/list/:id', listUserTrans);

module.exports.TransactionRouter = router;
