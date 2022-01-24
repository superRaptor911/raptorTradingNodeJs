import {Document, model, Schema} from 'mongoose';

export interface FundTransfer extends Document {
  username: string;
  amount: number;
  transType: string;
  fee: number;
  donation: number;
  time: Date;
}

const fundTransfer = new Schema({
  username: String,
  amount: Number,
  transType: String,
  fee: Number,
  donation: Number,
  time: Date,
});

export const FundTransferModel = model<FundTransfer>(
  'FundTransferModel',
  fundTransfer,
);
