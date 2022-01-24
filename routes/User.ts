import {Router} from 'express';
import {
  addUser,
  deleteUser,
  getUser,
  getAlluser,
  loginUser,
} from '../controller/User';

const UserRouter = Router();

UserRouter.get('/', getAlluser);
UserRouter.post('/login', loginUser);
UserRouter.post('/add', addUser);
UserRouter.delete('/:id', deleteUser);
UserRouter.get('/:id', getUser);

export default UserRouter;
