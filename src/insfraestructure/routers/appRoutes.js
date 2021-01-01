import express from 'express';

import userController from '../controllers/users/userController';
import productController from '../controllers/product/productController';

const userRouters = express.Router();

userRouters.post('/users-register', userController.registerUsers);
userRouters.post('/admin-register', userController.registerUsers);
userRouters.post('/products-register', productController.createProduct);

//routers.get()

export default userRouters;
