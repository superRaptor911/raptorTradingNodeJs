import {changePercent} from '../../Utility';
import {api_getCoinPriceHistory, getCurPrice, Point} from '../helper';
import {COINS} from './stabConfig';

let wallet: any = {
  balance: 0,
};

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

function historyToPrice(historyItem: number[], coinId: string) {
  const prices: any = {};
  prices[coinId] = {
    last: historyItem[3],
    buy: historyItem[3],
    sell: historyItem[3],
  };
  return prices;
}

function printStartAndEndDate(s: number[], e: number[]) {
  const sd = new Date(s[0] * 1000);
  const ed = new Date(e[0] * 1000);

  console.log('Start Date : ', sd);
  console.log('End Date : ', ed);
}

function calcAverage(points: Point[]) {
  let total = 0;
  points.forEach(item => (total += item.y));
  return total / points.length;
}

function getNetWorth(prices: any) {
  COINS.forEach(item => {
    sell(prices[item], item, wallet[item]);
  });
  const total = wallet.balance;
  return Number(total.toFixed(2));
}

function resetWallet(balance: number) {
  wallet = {
    balance: balance,
  };

  COINS.forEach(item => (wallet[item] = 0));
}

function logic(
  trans: transStruct[],
  asset: string,
  price: number,
  change: number,
  bf: number,
  sf: number,
) {
  let assetAv = true;
  for (const i of trans) {
    if (i.asset == asset) {
      assetAv = false;
      const changeSince = changePercent(i.price, price);
      // stop loss
      if (changeSince < -sf * 0.8) {
        // console.log(`Selling stop loss (${i.price},${price})`);
        sell(price, asset, wallet[asset]);
        i.isValid = false;
      }
      if (changeSince > sf) {
        // console.log(`Selling profit (${i.price},${price})`);
        sell(price, asset, wallet[asset]);
        i.isValid = false;
      }
    }
  }

  if (assetAv && change > bf) {
    // console.log(`--Buying ${asset}--`);
    const result = buy(price, asset, 300);
    trans.push({asset: asset, price: price, isValid: result});
  }
}

interface transStruct {
  asset: string;
  price: number;
  isValid: boolean;
}

function simulate(
  histories: any,
  count: number,
  buyFactor: number,
  sellFactor: number,
) {
  resetWallet(1000);

  let trans: transStruct[] = [];
  const coinPrices: any = {};

  let prevPoint: any = {};
  COINS.forEach(item => {
    prevPoint[item] = 0;
  });

  for (let i = 0; i < count; i++) {
    for (let j of COINS) {
      const item = histories[j][i];
      const prices = historyToPrice(item, j);
      const price = getCurPrice(prices, j);
      coinPrices[j] = price;

      if (prevPoint[j] != 0) {
        const change = changePercent(prevPoint[j], price);
        logic(trans, j, price, change, buyFactor, sellFactor);
      }
      trans = trans.filter(item => item.isValid);
      prevPoint[j] = price;
    }
  }
  // console.log(wallet);
  console.log('Wallet balance ', getNetWorth(coinPrices));
}

// a[1] last
// a[3] buy
// a[4] sell
async function mainFunc() {
  resetWallet(1000);
  const count = 300;
  const histories: any = {};
  for (const coinId of COINS) {
    const history = await api_getCoinPriceHistory(coinId, 5, count);
    histories[coinId] = history;
  }

  console.log('Got price histories');
  // printStartAndEndDate(histories[0][0], last);
  const factor = 1;
  let buyFactor = 1;

  simulate(histories, count, 4, 10);
  // for (let i = 0; i < 15; i++) {
  //   let sellFactor = 1;
  //   for (let j = 0; j < 15; j++) {
  //     // console.log([buyFactor, sellFactor]);
  //     console.log(`(${buyFactor}, ${sellFactor})`);
  //     simulate(histories, count, buyFactor, sellFactor);
  //     sellFactor += factor;
  //   }
  //   buyFactor += factor;
  // }
}

mainFunc();
