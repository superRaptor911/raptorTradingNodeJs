const {default: fetch} = require('node-fetch');

async function addUser() {
  try {
    const user = {name: 'Raptor x', email: 'ra@inc', avatar: 'preview.png'};
    const response = await fetch('http://localhost:8080/users/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    console.log('addUser ', data);
  } catch (e) {
    console.error('userTest::addUser ', e);
  }
}

async function deleteUser() {
  try {
    await fetch('http://localhost:8080/users/Raptor x', {
      method: 'DELETE',
    });
  } catch (e) {
    console.error('userTest::deleteUser ', e);
  }
}

async function getUser() {
  try {
    const response = await fetch('http://localhost:8080/users/Raptor x', {
      method: 'GET',
    });
    const data = await response.json();
    console.log('getUser ', data);
  } catch (e) {
    console.error('userTest::deleteUser ', e);
  }
}

async function main() {
  await addUser();
  await getUser();
  await deleteUser();
  await getUser();
}

main();
