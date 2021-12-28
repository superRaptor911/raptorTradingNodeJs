const crypto = require('crypto');
const {default: fetch} = require('node-fetch');

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

export async function wazirxPostRequest(endpoint, data) {
  data.signature = getSignature(secretKey, data);

  try {
    const response = await fetch(server + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },

      body: JSON.stringify(data),
    });

    const dat = await response.json();
    return dat;
  } catch (e) {
    /* handle error */
    console.error('Utility::getRequest ', e);
    throw e;
  }
}

export async function wazirxGetRequest(endpoint, data) {
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
    console.error('Utility::getRequest ', e);
    throw e;
  }
}
