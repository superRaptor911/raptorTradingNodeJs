const {postRequest, getRequest} = require('../Utility');
const {default: fetch} = require('node-fetch');

async function addFund(name) {
  try {
    const response = await postRequest('http://localhost:8080/fund/transfer', {
      username: name,
      transType: 'DEPOSIT',
      amount: 500,
      fee: 10,
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
  } catch (e) {
    console.error('userTest::deleteUser ', e);
  }
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

