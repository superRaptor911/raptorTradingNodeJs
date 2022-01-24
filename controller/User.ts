import express from 'express';
import {UserModel} from '../models/UserModel';
import {hashString} from '../Utility';

export async function loginUser(req: express.Request, res: express.Response) {
  try {
    const {email, password} = req.body;
    const doc = await UserModel.findOne({email: email});
    if (doc) {
      if (hashString(password) === doc.password) {
        res.status(200).json({status: true, message: 'Success'});
      } else {
        res.status(200).json({status: false, message: 'Wrong Password'});
      }
    } else {
      throw 'User Not Found';
    }
  } catch (e) {
    console.error('User::addUser', e);
    res.status(500).json({status: false, message: 'User not found'});
  }
}

export async function getAlluser(_req: express.Request, res: express.Response) {
  try {
    const result = await UserModel.find({}).sort({name: 1});
    res.status(200).json({status: true, data: result});
  } catch (e) {
    res.status(500).json({status: false, message: e});
  }
}

export async function addUser(req: express.Request, res: express.Response) {
  try {
    const {name, email, avatar} = req.body;
    const doc = new UserModel();
    doc.name = name;
    doc.email = email;
    doc.avatar = avatar;
    await doc.save();

    res.status(200).json({status: true, message: 'Success'});
  } catch (e) {
    console.error('User::addUser', e);
    res.status(500).json({status: false, message: e});
  }
}

export async function getUser(req: express.Request, res: express.Response) {
  try {
    const name = req.params.id;
    const result = await UserModel.findOne({name: name});

    if (result) {
      res.status(200).json({status: true, data: result});
    } else {
      res
        .status(500)
        .json({status: false, message: `Failed to find user ${name}`});
    }
  } catch (e) {
    res.status(500).json({status: false, message: e});
  }
}

export async function deleteUser(req: express.Request, res: express.Response) {
  try {
    const name = req.params.id;
    await UserModel.deleteOne({name: name});
    res.status(200).json({status: true});
  } catch (e) {
    res.status(500).json({status: false, message: e});
  }
}
