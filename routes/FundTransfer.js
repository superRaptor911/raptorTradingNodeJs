const {
  transferFund,
  deleteFundTransfer,
  listAll,
  listUserTransfer,
} = require('../controller/FundTransfer');

const router = require('express').Router();

router.post('/transfer', transferFund);
router.get('/list', listAll);
router.get('/list/:id', listUserTransfer);
router.delete('/:id', deleteFundTransfer);

module.exports.FundTransferRouter = router;
