/* eslint-disable no-throw-literal */
const {postRequest, getRequest} = require('../Utility');
const {default: fetch} = require('node-fetch');

// const server = 'https://raptor-trading.herokuapp.com';
const server = 'http://localhost:8080';

function checkStatus(data) {
  if (data && data.status) {
    return;
  }

  throw 'Error in request';
}

async function addFund(
  name,
  amount = 500,
  fee = 10,
  donation = 0,
  date = null,
) {
  try {
    const response = await postRequest(server + '/fund/transfer', {
      username: name,
      transType: 'DEPOSIT',
      amount: amount,
      fee: fee,
      donation: donation,
      time: date || new Date(),
    });

    console.log(response);
  } catch (e) {
    console.error('FundTest::addFund', e);
  }
}

async function withDrawFund(
  name,
  amount = 500,
  fee = 10,
  donation = 0,
  date = null,
) {
  try {
    const response = await postRequest(server + '/fund/transfer', {
      username: name,
      transType: 'SELL',
      amount: amount,
      fee: fee,
      donation: donation,
      force: true,
      time: date || new Date(),
    });

    console.log(response);
  } catch (e) {
    console.error('FundTest::addFund', e);
  }
}

async function addUser(name, email = 'r@inc', avatar = 'gg') {
  try {
    const user = {name: name, email: email, avatar: avatar};
    const data = await postRequest(server + '/users/add', user);
    console.log('addUser ', data);
  } catch (e) {
    console.error('userTest::addUser ', e);
  }
}

async function getUser(name) {
  try {
    const data = await getRequest(server + '/users/' + name);
    return data;
  } catch (e) {
    console.error('userTest::deleteUser ', e);
  }
  return null;
}

async function deleteUser(name) {
  try {
    await fetch(server + '/users/' + name, {
      method: 'DELETE',
    });
  } catch (e) {
    console.error('userTest::deleteUser ', e);
  }
}

async function listcoins() {
  try {
    const data = await getRequest(server + '/coins/');
    checkStatus(data);
    console.log('listcoins ', data);
  } catch (e) {
    console.error('coinTest::listcoins ', e);
  }
}

async function addCoin(name, id = 'adainr', avatar = 'gg.png') {
  try {
    const coin = {name: name, id: id, avatar: avatar};
    const data = await postRequest(server + '/coins/add', coin);
    console.log(data);
  } catch (e) {
    console.error('coinTest::addCoin ', e);
  }
}

async function deleteCoin(name) {
  try {
    await fetch(server + '/coins/delete/' + name, {
      method: 'DELETE',
    });
  } catch (e) {
    console.error('coinTest::deleteCoin ', e);
  }
}

async function coinPrice() {
  try {
    const data = await getRequest(server + '/coins/prices');
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
      force: true,
      transType: 'BUY',
    };
    const data = await postRequest(server + '/transaction/add', body);
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
    const data = await postRequest(server + '/transaction/add', body);
    console.log(data);
  } catch (e) {
    /* handle error */
    console.error('api::api', e);
  }
}

async function getUsers() {
  try {
    const data = await getRequest(server + '/users/');
    return data;
  } catch (e) {
    console.error('userTest::deleteUser ', e);
  }
  return null;
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
module.exports.testGetUsers = getUsers;
