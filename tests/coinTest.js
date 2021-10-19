const {
  testListCoin,
  testAddCoin,
  testCoinPrice,
  testDeleteCoin,
} = require('./api');

async function main() {
  await testListCoin();
  await testAddCoin('Doge Coin');
  await testListCoin();
  await testCoinPrice();
  await testDeleteCoin('Doge Coin');
  await testListCoin();
}

main();
