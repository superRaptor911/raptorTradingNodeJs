import {Document, model, Schema} from 'mongoose';

export interface Donation extends Document {
  username: string;
  amount: number;
  transId: string;
}

const donModel = new Schema<Donation>({
  username: String,
  amount: Number,
  transId: String,
});

export const DonationModel = model<Donation>('Donations', donModel);
