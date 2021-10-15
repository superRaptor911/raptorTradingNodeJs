const UserModel = require('../models/UserModel');

async function getAlluser(_req, res) {
  try {
    const result = await UserModel.find({});
    res.status(200).json({status: true, data: result});
  } catch (e) {
    res.status(500).json({status: false, message: e});
  }
}

async function addUser(req, res) {
  try {
    const {name, email, avatar} = req.body;
    const doc = new UserModel();
    doc.name = name;
    doc.email = email;
    doc.avatar = avatar;
    await doc.save();

    res.status(200).json({status: true});
  } catch (e) {
    console.error('User::addUser', e);
    res.status(500).json({status: false, message: e});
  }
}

async function getUser(req, res) {
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

async function deleteUser(req, res) {
  try {
    const name = req.params.id;
    await UserModel.deleteOne({name: name});
    res.status(200).json({status: true});
  } catch (e) {
    res.status(500).json({status: false, message: e});
  }
}

module.exports.getAlluser = getAlluser;
module.exports.addUser = addUser;
module.exports.getUser = getUser;
module.exports.deleteUser = deleteUser;
