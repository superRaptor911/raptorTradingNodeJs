const {sleep} = require('../../Utility');
const {testCoinPrice} = require('../api');

async function main() {
  let ada = 10.0;
  let inr = 0.0;

  let basePrice = -1;
  let oldPrice = -1;

  let steps = 1;
  while (true) {
    const prices = await testCoinPrice();
    const price = prices.adainr.last;
    console.log('price : ', price);

    if (basePrice < 0) {
      basePrice = price;
      oldPrice = price;
    }

    if (steps % 10 === 0) {
      basePrice = price;
    }

    const delta = (100 * (price - basePrice)) / basePrice;

    if (delta < -1) {
      if (ada >= 1) {
        ada -= 1;
        inr += ada * price;
        inr -= 0.002 * price;
        oldPrice = price;
        console.log('selling 1 ada');
        console.log('Ada : ', ada, ' Inr : ', inr);
      }
    }

    const deltaOld = (100 * (price - oldPrice)) / oldPrice;

    if (deltaOld > 1) {
      if (inr >= price) {
        ada += 1;
        inr -= price;
        inr -= 0.002 * price;
        console.log('buying 1 ada');
        console.log('Ada : ', ada, ' Inr : ', inr);
      }
    }

    await sleep(60000);
    steps += 1;
  }
}

main();
