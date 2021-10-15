const {
  transferFund,
  deleteFundTransfer,
} = require('../controller/FundTransfer');

const router = require('express').Router();

router.post('/transfer', transferFund);
router.delete('/:id', deleteFundTransfer);

module.exports.FundTransferRouter = router;
