const {postRequest, getRequest} = require('../Utility');
const {default: fetch} = require('node-fetch');

async function addFund(name, amount = 500, fee = 10) {
  try {
    const response = await postRequest('http://localhost:8080/fund/transfer', {
      username: name,
      transType: 'DEPOSIT',
      amount: amount,
      fee: fee,
      donation: 0,
      time: new Date(),
    });

    console.log(response);
  } catch (e) {
    console.error('FundTest::addFund', e);
  }
}

async function withDrawFund(name, amount = 500, fee = 10) {
  try {
    const response = await postRequest('http://localhost:8080/fund/transfer', {
      username: name,
      transType: 'SELL',
      amount: amount,
      fee: fee,
      donation: 0,
      time: new Date(),
    });

    console.log(response);
  } catch (e) {
    console.error('FundTest::addFund', e);
  }
}

async function addUser(name) {
  try {
    const user = {name: name, email: 'ra@inc', avatar: 'preview.png'};
    const data = await postRequest('http://localhost:8080/users/add', user);
    console.log('addUser ', data);
  } catch (e) {
    console.error('userTest::addUser ', e);
  }
}

async function getUser(name) {
  try {
    const data = await getRequest('http://localhost:8080/users/' + name);
    console.log('getUser ', data);
    return data;
  } catch (e) {
    console.error('userTest::deleteUser ', e);
  }
  return null;
}

async function deleteUser(name) {
  try {
    await fetch('http://localhost:8080/users/' + name, {
      method: 'DELETE',
    });
  } catch (e) {
    console.error('userTest::deleteUser ', e);
  }
}

async function listcoins() {
  try {
    const data = await getRequest('http://localhost:8080/coins/');
    console.log('listcoins ', data);
  } catch (e) {
    console.error('coinTest::listcoins ', e);
  }
}

async function addCoin(name, id = 'adainr') {
  try {
    const coin = {name: name, id: id, avatar: 'preview.png'};
    const data = await postRequest('http://localhost:8080/coins/add', coin);
    console.log('addCoin ', data);
  } catch (e) {
    console.error('coinTest::addCoin ', e);
  }
}

async function deleteCoin(name) {
  try {
    await fetch('http://localhost:8080/coins/delete/' + name, {
      method: 'DELETE',
    });
  } catch (e) {
    console.error('coinTest::deleteCoin ', e);
  }
}

async function coinPrice() {
  try {
    const data = await getRequest('http://localhost:8080/coins/prices');
    console.log('coinPrice ', data);
  } catch (e) {
    console.error('coinTest::coinPrice ', e);
  }
}

async function buyCoin(name, coin, count, price, fees = 0) {
  try {
    const body = {
      username: name,
      coin: coin,
      coinCount: count,
      price: price,
      fee: fees,
      transType: 'BUY',
    };
    const data = await postRequest(
      'http://localhost:8080/transaction/add',
      body,
    );
    console.log(data);
  } catch (e) {
    /* handle error */
    console.error('api::api', e);
  }
}

async function sellCoin(name, coin, count, price, fees = 0) {
  try {
    const body = {
      username: name,
      coin: coin,
      coinCount: count,
      price: price,
      fee: fees,
      transType: 'SELL',
    };
    const data = await postRequest(
      'http://localhost:8080/transaction/add',
      body,
    );
    console.log(data);
  } catch (e) {
    /* handle error */
    console.error('api::api', e);
  }
}

module.exports.testAddUser = addUser;
module.exports.testGetUser = getUser;
module.exports.testDeleteUser = deleteUser;
module.exports.testAddFund = addFund;
module.exports.testWithdrawFund = withDrawFund;
module.exports.testListCoin = listcoins;
module.exports.testAddCoin = addCoin;
module.exports.testDeleteCoin = deleteCoin;
module.exports.testCoinPrice = coinPrice;
module.exports.testBuyCoin = buyCoin;
module.exports.testSellCoin = sellCoin;
