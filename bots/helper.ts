import {getRequest} from '../Utility';

// const server = 'http://localhost:8080';
const server = 'https://raptor-trading.herokuapp.com';

export async function api_getCoinPrices() {
  try {
    const data: any = await getRequest(server + '/coins/prices');
    return data.data;
  } catch (e) {
    console.error('helper::api_getCoinPrices', e);
  }
}

export async function api_getUser(username: string) {
  try {
    const data: any = await getRequest(server + '/users/' + username);
    return data.data;
  } catch (e) {
    console.error('helper::api_getUser', e);
  }
}

export async function api_getCoinPriceHistory(
  coinId: string,
  period = 60,
  limit = 50,
) {
  try {
    const data: any = await getRequest(
      server +
        `/coins/history/?coinId=${coinId}&period=${period}&limit=${limit}`,
    );
    return data.data;
  } catch (e) {
    console.error('helper::api_getUser', e);
  }
}

export type Point = {
  x: number;
  y: number;
};

export function getCurPrice(prices: any, coinId: string) {
  return Number(prices[coinId].last);
}

export function getSellPrice(prices: any, coinId: string) {
  return Number(prices[coinId].buy);
}

export function getBuyPrice(prices: any, coinId: string) {
  return Number(prices[coinId].sell);
}

export function calculateSlope(points: Point[]) {
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
