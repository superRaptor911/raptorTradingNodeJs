import {Document, model, Schema} from 'mongoose';

export interface Coin extends Document {
  name: string;
  id: string;
  avatar: string;
}

const coinModel = new Schema<Coin>({
  name: String,
  id: {
    type: String,
    unique: true,
  },
  avatar: String,
});

export const CoinModel = model<Coin>('Coin', coinModel);
