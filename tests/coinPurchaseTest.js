const {
  testAddUser,
  testAddFund,
  testGetUser,
  testDeleteUser,
  testDeleteCoin,
  testAddCoin,
  testBuyCoin,
  testSellCoin,
} = require('./api');

async function main() {
  await testAddUser('Aditya');
  await testAddFund('Aditya', 100);
  await testGetUser('Aditya');

  await testAddCoin('Matic');
  await testBuyCoin('Aditya', 'Matic', 1, 50, 10);
  await testBuyCoin('Aditya', 'Matic', 1, 25, 10);
  // let usr = await testGetUser('Aditya');
  // console.log(usr.data.wallet);

  await testSellCoin('Aditya', 'Matic', 1, 50, 10);
  const usr = await testGetUser('Aditya');
  console.log(usr.data.wallet);

  await testDeleteCoin('Matic');
  await testDeleteUser('Aditya');
}

main();
