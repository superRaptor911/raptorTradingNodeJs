const {wazirxGetOrderInfo} = require('../api');

async function testGG() {
  const result = await wazirxGetOrderInfo('778559074');
  console.log(result);
}

testGG();
