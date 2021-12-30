/* eslint-disable no-throw-literal */
const {hashString} = require('../../Utility');
const UserModel = require('../../models/UserModel');

async function verifyUser(email, password) {
  const usr = await UserModel.findOne({email: email});
  if (!usr) {
    throw 'Failed to find user';
  }

  if (hashString(password) !== usr.password) {
    throw 'Wrong Password';
  }
}

module.exports.verifyUserAuth = verifyUser;
