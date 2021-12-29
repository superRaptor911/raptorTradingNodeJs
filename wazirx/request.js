const crypto = require('crypto');
const {default: fetch} = require('node-fetch');

if (!process.env.WAZIRX_SECRETKEY) {
  console.log('loading ...');
  const dotenv = require('dotenv');
  dotenv.config();
}

const secretKey = process.env.WAZIRX_SECRETKEY;
const apiKey = process.env.WAZIRX_APIKEY;
const server = 'https://api.wazirx.com';

function getSignature(key, params) {
  const qs = new URLSearchParams(params);
  const string = qs.toString();
  const hmac = crypto.createHmac('sha256', key);
  const data = hmac.update(string);
  const genHmac = data.digest('hex');
  return genHmac;
}

async function wazirxPostRequest(endpoint, data) {
  data.timestamp = new Date().getTime();
  data.recvWindow = data.recvWindow ? data.recvWindow : 20000;
  data.signature = getSignature(secretKey, data);

  try {
    const response = await fetch(server + endpoint, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
      },

      body: new URLSearchParams(data),
    });

    const dat = await response.json();
    return dat;
  } catch (e) {
    /* handle error */
    console.error('Utility::wazirxPostRequest ', e);
    throw e;
  }
}

async function wazirxDeleteRequest(endpoint, data) {
  data.timestamp = new Date().getTime();
  data.recvWindow = data.recvWindow ? data.recvWindow : 20000;
  data.signature = getSignature(secretKey, data);

  try {
    const response = await fetch(server + endpoint, {
      method: 'DELETE',
      headers: {
        'X-API-KEY': apiKey,
      },

      body: new URLSearchParams(data),
    });

    const dat = await response.json();
    return dat;
  } catch (e) {
    /* handle error */
    console.error('Utility::wazirxDeleteRequest ', e);
    throw e;
  }
}

async function wazirxGetRequest(endpoint, data) {
  data.timestamp = new Date().getTime();
  data.recvWindow = data.recvWindow ? data.recvWindow : 20000;
  data.signature = getSignature(secretKey, data);

  const qs = new URLSearchParams(data);
  const string = qs.toString();
  const url = server + endpoint + '?' + string;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
    });

    const data = await response.json();
    return data;
  } catch (e) {
    /* handle error */
    console.error('Utility::wazirxGetRequest ', e);
    throw e;
  }
}

module.exports.wazirxGetRequest = wazirxGetRequest;
module.exports.wazirxPostRequest = wazirxPostRequest;
module.exports.wazirxDeleteRequest = wazirxDeleteRequest;
