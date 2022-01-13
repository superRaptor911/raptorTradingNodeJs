const {sleep} = require('../../Utility');
const {testCoinPrice} = require('../api');

async function main() {
  let ada = 10.0;
  let inr = 0.0;

  let maxPrice = -1;
  let minPrice = -1;

  let sold = false;

  while (true) {
    const prices = await testCoinPrice();
    const price = parseFloat(prices.adainr.last);
    console.log('price : ', price);
    maxPrice = Math.max(maxPrice, price);

    const delta = (100 * (price - maxPrice)) / maxPrice;

    if (delta < -1) {
      if (ada > 0) {
        inr += ada * price;
        inr -= ada * price * 0.002;
        ada = 0;
        minPrice = price;
        sold = true;
        console.log('Selling ada');
        console.log('ada : ', ada);
        console.log('inr : ', inr);
      }
    }

    if (sold) {
      minPrice = Math.min(minPrice, price);
      if (price > minPrice) {
        const adaCount = parseFloat(inr / price).toFixed(1);
        inr -= adaCount * price;
        inr -= adaCount * price * 0.002;
        ada += adaCount;
        sold = false;
        maxPrice = price;

        console.log('Buying ada');
        console.log('ada : ', ada);
        console.log('inr : ', inr);
      }
    }

    await sleep(60000);
  }
}

main();
