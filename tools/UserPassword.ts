import {initDB} from '../db/db';
import {UserModel} from '../models/UserModel';
import {sendMail, hashString} from '../Utility';

if (!process.env.SENDGRID_APIKEY) {
  console.log('loading ...');
  const dotenv = require('dotenv');
  dotenv.config();
}

initDB();

function makePass(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function generatePasswordForAll() {
  const users = await UserModel.find({});
  for (const i of users) {
    if (!i.password) {
      console.log('Generating Password for : ', i.name);
      const pass = makePass(8);
      console.log('Password : ', pass);
      console.log('Mailing to ', i.email);

      try {
        await sendMail(
          i.email,
          'Raptor Trading Password',
          `${pass} is your password for Raptor Trading. \nKeep it safe. Trading option will be available soon.\n\nFor The Emperor!`,
          `<b>${pass}</b> is your password for Raptor Trading.<br/>Keep it safe. Trading option will be available soon.<br/><br/>For The Emperor!`,
        );
        i.password = hashString(pass);
        await i.save();
      } catch (e) {
        /* handle error */
        console.error('UserPassword::Something went wrong', e);
      }
    }
  }
}

generatePasswordForAll();
