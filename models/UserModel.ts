import {Document, model, Schema} from 'mongoose';

interface Wallet {
  balance: number;
  investment: number;
  coins?: {[key: string]: number};
}

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  wallet: Wallet;
}

const userModel = new Schema<User>({
  name: {
    type: String,
    unique: true,
  },
  email: String,
  password: String,
  avatar: String,
  wallet: {
    balance: {
      type: Number,
      default: 0,
    },
    investment: {
      type: Number,
      default: 0,
    },
    coins: Object,
  },
});

export const UserModel = model<User>('User', userModel);
