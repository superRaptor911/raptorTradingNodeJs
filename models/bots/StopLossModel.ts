import {Document, model, Schema} from 'mongoose';

export interface StopLoss extends Document {
  username: string;
  isEnabled: boolean;
  coinId: string;
  transType: string;
  condition: string;
  price: number;
  count: number;
  orderId?: string | null;
  placeTime: Date;
}

const stopLossModel = new Schema<StopLoss>({
  username: String,
  isEnabled: {
    type: Boolean,
    default: false,
  },
  coinId: String,
  transType: String,
  condition: String,

  price: Number,
  count: Number,
  orderId: {type: String, default: null},
  placeTime: Date,
});

export const StopLossModel = model<StopLoss>('StopLossModel', stopLossModel);
