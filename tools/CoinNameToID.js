const {coinsDb} = require('./db/coins');
const {transactionDataBase} = require('./db/transactions');
const {usersDB} = require('./db/users');
const fs = require('fs');

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

function getCoinId(coinName) {
  const coins = coinsDb;
  for (const i of coins) {
    if (i.name === coinName) {
      return i.id;
    }
  }
}

function main() {
  const users = usersDB;
  const transactions = transactionDataBase;

  transactions.forEach(item => {
    item.coinId = getCoinId(item.coin);
    delete item.coin;
  });

  users.forEach(item => {
    for (const i in item.wallet.coins) {
      const id = getCoinId(i);
      item.wallet.coins[id] = item.wallet.coins[i].count;
      delete item.wallet.coins[i];
    }
  });

  storeData(transactions, './tools/output/trans.json');
  storeData(users, './tools/output/users.json');
}

main();
