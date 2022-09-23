import {getRequest, postRequest} from '../Utility';

// const server = 'http://localhost:8080';
// const server = 'https://raptor-trading.herokuapp.com';
const server = 'https://raptor-trading-back.herokuapp.com';

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

export async function api_placeBuyOrder(
  username: string,
  pass: string,
  coinId: string,
  count: number,
  price: number,
) {
  try {
    const data = {
      username: username,
      password: pass,
      coinId: coinId,
      coinCount: count,
      price: price,
      transType: 'BUY',
    };
    const result: any = await postRequest(server + '/wazirx/add', data);
    return result?.orderId;
  } catch (e) {
    console.error('helper::api_getCoinPrices', e);
    return null;
  }
}

export async function api_placeSellOrder(
  username: string,
  pass: string,
  coinId: string,
  count: number,
  price: number,
) {
  try {
    const data = {
      username: username,
      password: pass,
      coinId: coinId,
      coinCount: count,
      price: price,
      transType: 'SELL',
    };
    const result: any = await postRequest(server + '/wazirx/add', data);
    return result?.orderId;
  } catch (e) {
    console.error('helper::api_getCoinPrices', e);
    return null;
  }
}

export async function api_getOrderStatus(
  username: string,
  pass: string,
  orderId: string,
) {
  try {
    const data = {
      username: username,
      password: pass,
      orderId: orderId,
    };
    const result: any = await postRequest(server + '/wazirx/status', data);
    return result?.data;
  } catch (e) {
    console.error('helper::api_getCoinPrices', e);
    return null;
  }
}

export async function api_cancelOrder(
  username: string,
  pass: string,
  orderId: string,
  coinId: string,
) {
  try {
    const data = {
      username: username,
      password: pass,
      orderId: orderId,
      coinId: coinId,
    };
    const result: any = await postRequest(server + '/wazirx/cancel', data);
    return result?.status;
  } catch (e) {
    console.error('helper::api_getCoinPrices', e);
    return null;
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
