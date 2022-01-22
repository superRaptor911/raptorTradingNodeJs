import mongoose from 'mongoose';

const wazirxTrans = new mongoose.Schema({
  username: String,
  id: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    default: 'PENDING',
  },
  receipt: Object,
  remarks: {
    type: String,
    default: 'Placed By User',
  },
});

const WazirxTransactionModel = mongoose.model(
  'WazirxTransactionModel',
  wazirxTrans,
);
export default WazirxTransactionModel;
