import {Document, model, Schema} from 'mongoose';

export interface LockedAsset extends Document {
  username: string;
  id: string;
  asset: string;
  amount: number;
}

const lokedAssetModel = new Schema<LockedAsset>({
  username: String,
  id: {
    type: String,
    unique: true,
  },
  asset: String,
  amount: Number,
});

export const LockedAssetModel = model<LockedAsset>(
  'LockedAssetModel',
  lokedAssetModel,
);
