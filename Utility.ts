import sgMail from '@sendgrid/mail';
import fetch from 'cross-fetch';
import fs from 'fs';

if (!process.env.SENDGRID_APIKEY) {
  console.log('loading ...');
  const dotenv = require('dotenv');
  dotenv.config();
}

const apiKey = process.env.SENDGRID_APIKEY;
apiKey && sgMail.setApiKey(apiKey);

export async function postRequest(url: string, data: object) {
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

export async function getRequest(url: string) {
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

export function checkRequired(obj: {[key: string]: any}, values: string[]) {
  values.forEach(item => {
    if (obj[item] === undefined) {
      throw `Error: ${item} not set`;
    }
  });
}

export function hashString(string: string) {
  let hash = 0;
  let i;
  let chr;

  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return 'nt' + hash;
}

export async function sendMail(
  to: string,
  subject: string,
  text: string,
  html: string | null = null,
) {
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

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function fixedNumber(num: string | number) {
  return Number(Number(num).toFixed(10));
}

export function changePercent(n1: number, n2: number) {
  return (100 * (n2 - n1)) / n1;
}

export function writeJsonData(data: any, path: string) {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
}

export function readJsonData(path: string) {
  try {
    const data = fs.readFileSync(path);
    const json = JSON.parse(data.toString());
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
}
