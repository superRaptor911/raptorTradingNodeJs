const {default: fetch} = require('node-fetch');

async function listcoins() {
  try {
    const response = await fetch('http://localhost:8080/coins/', {
      method: 'GET',
    });
    const data = await response.json();
    console.log('listcoins ', data);
  } catch (e) {
    console.error('coinTest::listcoins ', e);
  }
}

async function addCoin() {
  try {
    const coin = {name: 'Ada', id: 'adainr', avatar: 'preview.png'};
    const response = await fetch('http://localhost:8080/coins/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coin),
    });

    const data = await response.json();
    console.log('addCoin ', data);
  } catch (e) {
    console.error('coinTest::addCoin ', e);
  }
}

async function deleteCoin() {
  try {
    await fetch('http://localhost:8080/coins/delete/adainr', {
      method: 'DELETE',
    });
  } catch (e) {
    console.error('coinTest::deleteCoin ', e);
  }
}

async function coinPrice() {
  try {
    const response = await fetch('http://localhost:8080/coins/prices', {
      method: 'GET',
    });
    const data = await response.json();
    console.log('coinPrice ', data);
  } catch (e) {
    console.error('coinTest::coinPrice ', e);
  }
}

async function main() {
  await listcoins();
  await addCoin();
  await listcoins();
  await coinPrice();
  await deleteCoin();
  await listcoins();
}

main();
