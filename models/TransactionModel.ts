import {Document, model, Schema} from 'mongoose';

export interface Transaction extends Document {
  username: string;
  coinId: string;
  coinCount: number;
  cost: number;
  transType: string;
  fee: number;
  time: Date;
}
const transModel = new Schema<Transaction>({
  username: {
    type: String,
  },
  coinId: String,
  coinCount: Number,
  cost: Number,
  transType: String,
  fee: Number,
  time: Date,
});

export const TransactionModel = model<Transaction>('Transactions', transModel);
