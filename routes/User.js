const {addUser, deleteUser, getUser} = require('../controller/User');

const router = require('express').Router();

router.post('/add', addUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUser);

module.exports.UserRouter = router;
