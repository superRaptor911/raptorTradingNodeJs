import {Coin} from '../../models/CoinModel';

export function coinData2coinPriceList(coinData: any, coins: Coin[]) {
  const coinPriceList: {[key: string]: any} = {};
  coins.forEach(item => {
    const id = item.id;
    const coinPriceData = coinData[id];
    if (coinPriceData) {
      coinPriceList[id] = coinPriceData;
    }
  });

  return coinPriceList;
}
