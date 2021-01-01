import express from 'express';

import userController from '../controllers/users/userController';

const userRouters = express.Router();

userRouters.post('/users-register', userController.registerUsers);
userRouters.post('/admin-register', userController.registerUsers);

//routers.get()

export default userRouters;
