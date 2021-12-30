const {
  addUser,
  deleteUser,
  getUser,
  getAlluser,
  loginUser,
} = require('../controller/User');

const router = require('express').Router();

router.get('/', getAlluser);
router.post('/login', loginUser);
router.post('/add', addUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUser);

module.exports.UserRouter = router;
