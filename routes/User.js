const {
  addUser,
  deleteUser,
  getUser,
  getAlluser,
} = require('../controller/User');

const router = require('express').Router();

router.get('/', getAlluser);
router.post('/add', addUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUser);

module.exports.UserRouter = router;
