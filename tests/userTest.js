const {testAddUser, testGetUser, testDeleteUser} = require('./api');

async function main() {
  await testAddUser('Aditya');
  await testGetUser('Aditya');
  await testDeleteUser('Aditya');
  await testGetUser('Aditya');
}

main();
