import {Document, model, Schema} from 'mongoose';

export interface WazirxTransaction extends Document {
  username: string;
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  receipt: any;
  remarks: string;
}

const wazirxTrans = new Schema<WazirxTransaction>({
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

export const WazirxTransactionModel = model<WazirxTransaction>(
  'WazirxTransactionModel',
  wazirxTrans,
);
