import {sleep} from '../../Utility';
import {api_getCoinPrices} from '../helper';

const sampleSize = 2;

const coinId = 'wrxinr';

const wallet = {
  balance: 0,
  adainr: 1,
};

enum MarketState {
  UP,
  DOWN,
  FLAT,
  NOT_SET,
}

type Point = {
  x: number;
  y: number;
};

function getCurPrice(prices: any, coinId: string) {
  return Number(prices[coinId].last);
}

function getSellPrice(prices: any, coinId: string) {
  return Number(prices[coinId].buy);
}

function getBuyPrice(prices: any, coinId: string) {
  return Number(prices[coinId].sell);
}

function calculateSlope(points: Point[]) {
  let slope = 0;
  let Ex = 0;
  let Ex2 = 0;
  let Ey = 0;
  let Eyx = 0;
  let n = points.length;

  points.forEach(point => {
    Ex += point.x;
    Ey += point.y;
    Eyx += point.x * point.y;
    Ex2 += point.x * point.x;
  });

  slope = (Ey * Ex - n * Eyx) / (Ex * Ex - n * Ex2);
  slope = slope == Number.NaN ? 0 : slope;
  return Number(slope.toFixed(2));
}

function sell(price: number) {
  if (wallet.adainr > 0) {
    const total = wallet.adainr * price;
    wallet.balance += total * 0.998;
    wallet.adainr = 0;
  }
}

function buy(price: number) {
  if (wallet.balance > 0) {
    const total = Number((wallet.balance / price).toFixed(1));
    wallet.adainr = total;
    wallet.balance -= total * price * 1.002;
  }
}

async function mainFunc() {
  let points: Point[] = [];

  let x = 0;
  while (true) {
    const prices = await api_getCoinPrices();
    const price = getCurPrice(prices, coinId);

    points.push({x: x, y: price});

    if (points.length >= sampleSize) {
      const slope = calculateSlope(points);
      if (slope > 0.07) {
        buy(getBuyPrice(prices, coinId));
        console.log('Buying ', wallet);
      }
      if (slope < -0.05) {
        sell(getSellPrice(prices, coinId));
        console.log('Selling ', wallet);
      }
      console.log(price);
      console.log('slope is :', slope);
      points.shift();
    }
    console.log('Iteration : ', x, '\n');
    x++;
    await sleep(60000);
  }
}

mainFunc();
