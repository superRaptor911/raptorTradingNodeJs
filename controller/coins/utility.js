function coinData2coinPriceList(coinData, coins) {
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

module.exports.coinData2coinPriceList = coinData2coinPriceList;
