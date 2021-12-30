/* eslint-disable no-throw-literal */
const {hashString} = require('../../Utility');
const UserModel = require('../../models/UserModel');

async function verifyUser(username, password) {
  const usr = await UserModel.findOne({username: username});
  if (!usr) {
    throw 'Failed to find user';
  }

  if (hashString(password) !== usr.password) {
    throw 'Wrong Password';
  }
}

module.exports.verifyUserAuth = verifyUser;
