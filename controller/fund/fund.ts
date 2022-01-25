import {DonationModel} from '../../models/DonationModel';
import {UserModel} from '../../models/UserModel';

export async function depositFund(
  username: string,
  amount: number,
  fee: number,
  donation: number,
) {
  try {
    const user = await UserModel.findOne({name: username});
    if (user) {
      user.wallet.balance += amount - fee - donation;
      user.wallet.investment += amount;
      await user.save();
    } else {
      throw 'User Not Found';
    }
  } catch (e) {
    console.error('FundTransfer::depositFund ', e);
    throw e;
  }
}

export async function withdrawFund(
  username: string,
  amount: number,
  fee: number,
  donation: number,
  force: boolean,
) {
  try {
    const user = await UserModel.findOne({name: username});
    if (user) {
      const balance = user.wallet.balance - amount;

      if (!force && balance < 0) {
        throw 'Low balance';
      }
      user.wallet.balance = balance;
      user.wallet.investment -= amount - fee - donation;
      await user.save();
    } else {
      throw 'User Not Found';
    }
  } catch (e) {
    console.error('FundTransfer::withdrawFund ', e);
    throw e;
  }
}

export async function addDonation(
  username: string,
  amount: number,
  id: string,
) {
  if (amount > 0) {
    try {
      const doc = new DonationModel();
      doc.username = username;
      doc.amount = amount;
      doc.transId = id;
      await doc.save();
    } catch (e) {
      /* handle error */
      console.error('fund::addDonation', e);
      throw e;
    }
  }
}
