/* eslint-disable no-throw-literal */
const {default: fetch} = require('node-fetch');
const sgMail = require('@sendgrid/mail');

if (!process.env.SENDGRID_APIKEY) {
  console.log('loading ...');
  const dotenv = require('dotenv');
  dotenv.config();
}

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

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

function hashString(string) {
  let hash = 0;
  let i;
  let chr;

  if (this.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return 'nt' + hash;
}

async function sendMail(to, subject, text, html = null) {
  try {
    const msg = {
      to: to,
      from: 'raptor.inc2018@gmail.com',
      subject: subject,
      text: text,
      html: html || text,
    };

    await sgMail.send(msg);
  } catch (e) {
    /* handle error */
    console.error('UserPassword::Failed to  send mail', e);
  }
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function fixedNumber(num) {
  return Number(parseFloat(num).toFixed(10));
}

module.exports.postRequest = postRequest;
module.exports.getRequest = getRequest;
module.exports.checkRequired = checkRequired;
module.exports.hashString = hashString;
module.exports.sendMail = sendMail;
module.exports.sleep = sleep;
module.exports.fixedNumber = fixedNumber;
