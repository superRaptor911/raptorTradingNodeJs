import {rmSync} from 'fs';
import {changePercent, readJsonData, sleep, writeJsonData} from '../../Utility';
import {
  api_getCoinPrices,
  getBuyPrice,
  getCurPrice,
  getSellPrice,
} from '../helper';
import {COINS} from './stabConfig';

const botConfig = {
  iterations: 300,
  waitTime: 300000,
  buyFactor: 4,
  sellFactor: 9,
  amount: 300,
  transSavePath: 'temp/trans-sim-rt.json',
  walletSavePath: 'temp/wallet-sim-rt.json',
};

let wallet: any = {};

interface transStruct {
  asset: string;
  price: number;
  isValid: boolean;
}

function resetWallet(balance: number) {
  wallet = {
    balance: balance,
  };

  COINS.forEach(item => (wallet[item] = 0));
}

function sell(price: number, coinId: string, amount: number) {
  if (wallet[coinId] >= amount) {
    const total = amount * price;
    wallet.balance += total * 0.998;
    wallet[coinId] -= amount;
    return true;
  }
  return false;
}

function buy(price: number, coinId: string, amount: number) {
  amount = Math.min(wallet.balance, amount);
  if (amount > 50) {
    const count = amount / price;
    wallet[coinId] += count;
    wallet.balance -= amount * 1.002;
    return true;
  }
  return false;
}

function getNetWorth(prices: any) {
  COINS.forEach(item => {
    sell(prices[item], item, wallet[item]);
  });
  const total = wallet.balance;
  return Number(total.toFixed(2));
}

function logic(
  trans: transStruct[],
  asset: string,
  price: number,
  change: number,
  buyPrice: number,
  sellPrice: number,
) {
  let assetAv = true;
  let modified = false;
  for (const i of trans) {
    if (i.asset == asset) {
      assetAv = false;
      const changeSince = changePercent(i.price, price);
      // stop loss
      if (changeSince < -botConfig.sellFactor * 0.75) {
        console.log(`Selling stop loss (${i.price},${price})`);
        sell(sellPrice, asset, wallet[asset]);
        i.isValid = false;
        modified = true;
      }
      if (changeSince > botConfig.sellFactor) {
        console.log(`Selling profit (${i.price},${price})`);
        sell(sellPrice, asset, wallet[asset]);
        i.isValid = false;
        modified = true;
      }
    }
  }

  if (assetAv && change > botConfig.buyFactor) {
    console.log(`--Buying ${asset}--`);
    const result = buy(buyPrice, asset, 300);
    trans.push({asset: asset, price: price, isValid: result});
    modified = true;
  }

  if (modified) {
    writeJsonData(trans, botConfig.transSavePath);
    writeJsonData(wallet, botConfig.walletSavePath);
  }
}

function loadPreviousState() {
  const data: any = readJsonData(botConfig.transSavePath);
  const data2: any = readJsonData(botConfig.walletSavePath);
  if (data2) {
    console.log('using previous wallet');
    wallet = data2;
  }
  if (data) {
    console.log('using previous trans');
    const trans = data.filter((item: transStruct) => item.isValid);
    return trans;
  }
  return [];
}

async function mainFunc() {
  resetWallet(1000);
  let i = 0;
  let previousPrices: any = {};
  COINS.forEach(item => (previousPrices[item] = 0));
  let trans: transStruct[] = loadPreviousState();

  while (i < botConfig.iterations) {
    const prices = await api_getCoinPrices();
    for (let coinId of COINS) {
      const price = getCurPrice(prices, coinId);
      if (previousPrices[coinId] != 0) {
        const change = changePercent(previousPrices[coinId], price);
        console.log(`5 Min change for ${coinId} is ${change.toFixed(2)}`);
        logic(
          trans,
          coinId,
          price,
          change,
          getBuyPrice(prices, coinId),
          getSellPrice(prices, coinId),
        );
      }
      trans = trans.filter(item => item.isValid);
      previousPrices[coinId] = price;
    }
    await sleep(botConfig.waitTime);
    console.log('----END--OF--Iteration--', i, '----');
    i++;
  }
  console.log('End : net worth ', getNetWorth(previousPrices));
  rmSync(botConfig.walletSavePath);
  rmSync(botConfig.transSavePath);
}

mainFunc();
