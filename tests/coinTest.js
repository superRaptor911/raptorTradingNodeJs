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
    const coin = {name: 'Test coin', id: 'testCoin', previewImg: 'preview.png'};
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

async function main() {
  await listcoins();
  await addCoin();
  await listcoins();
}

main();
