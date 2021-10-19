const {postRequest, getRequest} = require('../Utility');
const {default: fetch} = require('node-fetch');

async function addUser() {
  try {
    const user = {name: 'Raptor x', email: 'ra@inc', avatar: 'preview.png'};
    const data = await postRequest('http://localhost:8080/users/add', user);
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
    const data = await getRequest('http://localhost:8080/users/Raptor x');
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
