const {
  testAddUser,
  testAddFund,
  testGetUser,
  testDeleteUser,
} = require('./api');

async function main() {
  await testAddUser('raptor');
  await testAddFund('raptor');
  await testGetUser('raptor');
  await testDeleteUser('raptor');
}

main();
