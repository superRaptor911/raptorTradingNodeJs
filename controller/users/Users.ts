/* eslint-disable no-throw-literal */
import {UserModel} from '../../models/UserModel';
import {hashString} from '../../Utility';

export async function verifyUserAuth(username: string, password: string) {
  const usr = await UserModel.findOne({name: username});
  if (!usr) {
    throw 'Failed to find user';
  }

  if (hashString(password) !== usr.password) {
    throw 'Wrong Password';
  }
}
