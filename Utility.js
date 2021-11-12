/* eslint-disable no-throw-literal */
const {default: fetch} = require('node-fetch');
async function postRequest(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const dat = await response.json();
    return dat;
  } catch (e) {
    /* handle error */
    console.error('Utility::postRequest ', e);
    throw e;
  }
}

async function getRequest(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    const data = await response.json();
    return data;
  } catch (e) {
    /* handle error */
    console.error('Utility::getRequest ', e);
    throw e;
  }
}

function checkRequired(obj, values) {
  values.forEach(item => {
    if (obj[item] === undefined) {
      throw `Error: ${item} not set`;
    }
  });
}

module.exports.postRequest = postRequest;
module.exports.getRequest = getRequest;
module.exports.checkRequired = checkRequired;
