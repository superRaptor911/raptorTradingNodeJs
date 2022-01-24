/* eslint-disable no-throw-literal */
import {UserModel} from '../../models/UserModel';
import {fixedNumber} from '../../Utility';

export async function buyCoin(
  username: string,
  coinId: string,
  coinCount: number,
  price: number,
  fee: number,
  force?: boolean,
) {
  try {
    const user = await UserModel.findOne({name: username});
    if (user) {
      const balance = user.wallet.balance;
      const newBalance = balance - coinCount * price;
      if (!force && newBalance < 0) {
        throw 'INSUFFICIENT BALANCE';
      }

      user.wallet.balance = newBalance - fee;
      if (!user.wallet.coins) {
        user.wallet.coins = {};
      }

      if (user.wallet.coins[coinId]) {
        user.wallet.coins[coinId] += coinCount;
      } else {
        user.wallet.coins[coinId] = coinCount;
      }
      // Remove floating point error
      user.wallet.coins[coinId] = fixedNumber(user.wallet.coins[coinId]);
      user.markModified('wallet');
      await user.save();
    } else {
      throw 'Unable to find user';
    }
  } catch (e) {
    /* handle error */
    console.error('trans::buyCoin ', e);
    throw e;
  }
}

export async function sellCoin(
  username: string,
  coinId: string,
  coinCount: number,
  price: number,
  fee: number,
) {
  try {
    const user = await UserModel.findOne({name: username});
    if (user) {
      const balance = user.wallet.balance;

      if (user.wallet.coins && user.wallet.coins[coinId]) {
        const coinBalance = fixedNumber(user.wallet.coins[coinId]);
        const newBalance = balance + coinCount * price;

        if (coinBalance >= coinCount) {
          user.wallet.coins[coinId] -= coinCount;
          user.wallet.balance = newBalance - fee;
        } else {
          throw 'INSUFFICIENT COINS';
        }

        // Remove floating point error
        user.wallet.coins[coinId] = fixedNumber(user.wallet.coins[coinId]);
        user.markModified('wallet');
        await user.save();
      } else {
        throw 'INSUFFICIENT COINS';
      }
    }
  } catch (e) {
    /* handle error */
    console.error('trans::sellCoin ', e);
    throw e;
  }
}
