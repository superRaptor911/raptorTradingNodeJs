import {CoinModel} from '../models/CoinModel';
import {TransactionModel} from '../models/TransactionModel';
import {StopLossModel} from '../models/bots/StopLossModel';
import {initDB} from '../db/db';
import {UserModel} from '../models/UserModel';

const coinId = 'lunainr';

if (!process.env.SENDGRID_APIKEY) {
  console.log('loading ...');
  const dotenv = require('dotenv');
  dotenv.config();
}

const removeFromTransactions = async () => {
  try {
    await TransactionModel.deleteMany({coinId: coinId});
  } catch (e) {
    console.error('DelistCoin::', e);
  }
};

const removeFromCoins = async () => {
  try {
    await CoinModel.deleteMany({id: coinId});
  } catch (e) {
    console.error('DelistCoin::', e);
  }
};

const removeFromStopLoss = async () => {
  try {
    await StopLossModel.deleteMany({id: coinId});
  } catch (e) {
    console.error('DelistCoin::', e);
  }
};

const removeFromUsers = async () => {
  const users = await UserModel.find({});
  for (const i of users) {
    if (i.wallet.coins && i.wallet.coins[coinId] != undefined) {
      delete i.wallet.coins[coinId];
      i.markModified('wallet');
      console.log(`removed ${coinId} from User ${i.name}`);
      await i.save();
    }
  }
};

const main = async () => {
  await initDB();
  await removeFromTransactions();
  console.log(`removed ${coinId} from transactions`);
  await removeFromCoins();
  console.log(`removed ${coinId} from coins`);
  await removeFromStopLoss();
  console.log(`removed ${coinId} from stopLossModel`);

  await removeFromUsers();
  console.log(`removed ${coinId} from User`);
};

main().then(() => console.log('Done....'));
