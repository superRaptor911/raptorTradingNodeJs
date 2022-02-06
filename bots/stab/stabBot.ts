import {rmSync} from 'fs';
import {changePercent, readJsonData, sleep, writeJsonData} from '../../Utility';
import {
  api_cancelOrder,
  api_getCoinPrices,
  api_getOrderStatus,
  api_getUser,
  api_placeBuyOrder,
  api_placeSellOrder,
  getBuyPrice,
  getCurPrice,
  getSellPrice,
} from '../helper';
import {StabKeys} from './botSecret';
import {COINS} from './stabConfig';

const botConfig = {
  iterations: 90000,
  waitTime: 300000,
  buyFactor: 4,
  sellFactor: 10,
  amount: 300,
  transSavePath: 'temp/trans-rt.json',
  walletSavePath: 'temp/wallet-rt.json',
  name: StabKeys.username,
  pass: StabKeys.password,
};

let wallet: any = {};

interface transStruct {
  asset: string;
  price: number;
  orderId: string;
  isValid: boolean;
}

function resetWallet(balance: number) {
  wallet = {
    balance: balance,
  };

  COINS.forEach(item => (wallet[item] = 0));
}

async function sell(price: number, coinId: string, amount: number) {
  if (wallet[coinId] >= amount) {
    const orderId = await api_placeSellOrder(
      botConfig.name,
      botConfig.pass,
      coinId,
      amount,
      price,
    );
    return orderId;
  }
  return false;
}

async function buy(price: number, coinId: string, amount: number) {
  amount = Math.min(wallet.balance, amount);
  if (amount > 50) {
    const count = amount / price;
    const orderId = await api_placeBuyOrder(
      botConfig.name,
      botConfig.pass,
      coinId,
      count,
      price,
    );
    return orderId;
  }
  return false;
}

async function logic(
  trans: transStruct[],
  asset: string,
  price: number,
  change: number,
) {
  let assetAv = true;
  let modified = false;
  for (const i of trans) {
    if (i.asset == asset) {
      assetAv = false;
      const changeSince = changePercent(i.price, price);
      // Stop loss sell
      if (changeSince < -botConfig.sellFactor * 0.8) {
        console.log(`Selling stop loss (${i.price},${price})`);
        const prices = await api_getCoinPrices();
        const sellPrice = getSellPrice(prices, asset);
        const orderId = await sell(sellPrice, asset, wallet[asset]);
        if (orderId) {
          i.orderId = orderId;
          modified = true;
        } else {
          console.error('stabBot::logic Error failed to place sell order');
        }
      }
      // Profit sell
      if (changeSince > botConfig.sellFactor) {
        console.log(`Selling profit (${i.price},${price})`);
        const prices = await api_getCoinPrices();
        const sellPrice = getSellPrice(prices, asset);
        const orderId = await sell(sellPrice, asset, wallet[asset]);
        if (orderId) {
          i.orderId = orderId;
          modified = true;
        } else {
          console.error('stabBot::logic Error failed to place sell order');
        }
      }
    }
  }

  if (assetAv && change > botConfig.buyFactor) {
    console.log(`--Buying ${asset}--`);
    const prices = await api_getCoinPrices();
    const buyPrice = getBuyPrice(prices, asset);
    // getSellPrice(prices, coinId),
    const result = await buy(buyPrice, asset, 300);
    if (result) {
      trans.push({
        asset: asset,
        price: price,
        isValid: true,
        orderId: result,
      });
      modified = true;
    } else {
      console.error('stabBot::logic failed to place order');
    }
  }

  if (modified) {
    writeJsonData(trans, botConfig.transSavePath);
    writeJsonData(wallet, botConfig.walletSavePath);
  }
}

async function transChecker(trans: transStruct[]) {
  for (const i of trans) {
    try {
      const receipt = await api_getOrderStatus(
        botConfig.name,
        botConfig.pass,
        i.orderId,
      );

      // On success
      if (receipt.status === 'done') {
        i.isValid = receipt.side == 'buy';
      } else if (receipt.status === 'cancel') {
        const qty = parseFloat(receipt.executedQty);
        if (receipt.side == 'buy') {
          i.isValid = qty > 0;
        }
      } else if (receipt.status === 'wait') {
        await api_cancelOrder(
          botConfig.name,
          botConfig.pass,
          i.orderId,
          i.asset,
        );
      }
    } catch (e) {
      /* handle error */
      console.error('stabBot::transChecker', e);
    }
  }

  const newTrans = trans.filter(item => item.isValid);
  return newTrans;
}

function loadPreviousState() {
  const data: any = readJsonData(botConfig.transSavePath);
  if (data) {
    console.log('using previous trans');
    const trans = data.filter((item: transStruct) => item.isValid);
    return trans;
  }
  return [];
}

async function updateWallet() {
  const user = await api_getUser(botConfig.name);
  if (user) {
    wallet.balance = user.wallet.balance;
    for (const i in user.wallet.coins) {
      wallet[i] = user.wallet.coins[i];
    }
  }
}

async function sellAllAssets(trans: transStruct[]) {
  for (let i of COINS) {
    if (wallet[i] > 0) {
      const prices = await api_getCoinPrices();
      const sellPrice = getSellPrice(prices, i);
      const orderId = await sell(sellPrice, i, wallet[i]);
    }
  }

  await sleep(botConfig.waitTime);
  const newTrans = await transChecker(trans);
  return newTrans;
}

async function mainFunc() {
  resetWallet(1000);
  let i = 0;
  let previousPrices: any = {};
  COINS.forEach(item => (previousPrices[item] = 0));
  let trans: transStruct[] = loadPreviousState();

  while (i < botConfig.iterations) {
    await updateWallet();
    const prices = await api_getCoinPrices();
    for (let coinId of COINS) {
      const price = getCurPrice(prices, coinId);
      if (previousPrices[coinId] != 0) {
        const change = changePercent(previousPrices[coinId], price);
        logic(trans, coinId, price, change);
      }
      previousPrices[coinId] = price;
    }
    await sleep(botConfig.waitTime);
    trans = await transChecker(trans);
    // console.log('----END--OF--Iteration--', i, '----');
    i++;
  }

  // console.log('Ending cycle... Selling all assets');
  // trans = await sellAllAssets(trans);
  console.log('done.');
  // rmSync(botConfig.walletSavePath);
  // rmSync(botConfig.transSavePath);
}

mainFunc();
