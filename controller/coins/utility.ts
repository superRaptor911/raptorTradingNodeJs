import CoinModel from '../../models/CoinModel';

export function coinData2coinPriceList(coinData, coins: typeof CoinModel[]) {
  const coinPriceList = {};

  coins.forEach(item => {
    const id = item.id;
    const coinPriceData = coinData[id];
    if (coinPriceData) {
      coinPriceList[id] = coinPriceData;
    }
  });

  return coinPriceList;
}
