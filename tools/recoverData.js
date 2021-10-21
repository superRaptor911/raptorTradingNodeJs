/* eslint-disable eqeqeq */
const fs = require('fs');
const {
  testAddCoin,
  testAddUser,
  testWithdrawFund,
  testAddFund,
  testBuyCoin,
  testSellCoin,
  testGetUser,
  testGetUsers,
} = require('../tests/api');

const data = fs.readFileSync('./raptorTrading.json', 'utf8');
// parse JSON string to JSON object
const databases = JSON.parse(data);

// console.log(databases);

async function recoverCoins() {
  console.log('//////////   ADDING COINS ///////');
  for (const item of databases.coins) {
    console.log('Adding ', item.name);
    await testAddCoin(item.name, item.id, item.avatar);
  }
}

async function recoverUsers() {
  console.log('//////////   ADDING USERS ///////');
  for (const item of databases.users) {
    console.log('Adding ', item.name);
    await testAddUser(item.name, item.email, item.avatar);
  }
}

async function recoverFundTransfer() {
  console.log('//////////   ADDING USERS ///////');
  for (const item of databases.fundTransferHistory) {
    if (item.transType == '1') {
      console.log('Adding ', item.username, ' Rs ', item.amount);
      await testAddFund(
        item.username,
        item.amount,
        item.fee,
        item.donation,
        new Date(item.time),
      );
    } else {
      console.log('Adding ', item.username, ' Rs ', item.amount);
      await testWithdrawFund(
        item.username,
        item.amount,
        item.fee,
        item.donation,
        new Date(item.time),
      );
    }
  }
}

async function recoverTransactions() {
  console.log('//////////   ADDING Transactions ///////');
  for (const item of databases.transactions) {
    if (item.transType == '1') {
      console.log(
        'Buying ',
        item.username,
        ' Coin ',
        item.coin,
        ' Count ',
        item.coinCount,
      );

      await testBuyCoin(
        item.username,
        item.coin,
        item.coinCount,
        item.cost,
        item.fee,
        new Date(item.time),
      );
    } else {
      await testSellCoin(
        item.username,
        item.coin,
        item.coinCount,
        item.cost,
        item.fee,
        new Date(item.time),
      );
    }
  }
}

function getInvestment(username) {
  for (const i of databases.investments) {
    if (i.username === username) {
      return i.investment;
    }
  }

  return null;
}

async function correctWallet() {
  console.log('\n\n\n//////////// Correcting Error //////');
  const users = await testGetUsers();

  for (const i of users.data) {
    console.log('Processing User ', i.name);
    const inv = i.wallet.investment;
    const inv2 = getInvestment(i.name);

    const diff = inv2 - inv;
    console.log('Diff = ', diff);
    if (diff > 0.5) {
      console.log('Fixing ....');
      await testAddFund(i.name, diff, 0, 0, new Date('2020-1-1'));
    }
  }
}

async function main() {
  await recoverUsers();
  await recoverCoins();

  await recoverFundTransfer();
  await recoverTransactions();
  await correctWallet();
}

main();

function chkRohit() {
  let investment = 0;
  let wallet = 0;

  for (const i of databases.fundTransferHistory) {
    if (i.username === 'Rohit J') {
      investment += parseFloat(i.amount);
      wallet += parseFloat(i.amount);
      wallet -= parseFloat(i.fee);
      wallet -= parseFloat(i.donation);
    }
  }

  console.log('Investment = ', investment, 'Wallet = ', wallet);

  for (const i of databases.transactions) {
    if (i.username === 'Rohit J') {
      if (i.transType == '1') {
        wallet -= parseFloat(i.coinCount) * parseFloat(i.cost);
        wallet -= parseFloat(i.fee);
      } else {
        wallet += parseFloat(i.coinCount) * parseFloat(i.cost);
        wallet -= parseFloat(i.fee);
      }
    }
  }

  console.log('Investment = ', investment, 'Wallet = ', wallet);
}

// chkRohit();
