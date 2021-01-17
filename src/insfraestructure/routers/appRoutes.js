import express from 'express';

import userController from '../controllers/users/userController';
import productController from '../controllers/product/productController';
import providerController from '../controllers/provider/providerController';
import storeController from '../controllers/store/storeController';
import loginController from '../controllers/login/loginController';
import profileController from '../controllers/profiles/profileController';
import { checkAuth } from '../../domine/middlewares/auth';

const userRouters = express.Router();

userRouters.post('/users-register', userController.registerUsers);
userRouters.post('/admin-register', userController.registerUsers);
userRouters.post('/products-register', productController.createProduct);
//Esta ruta es provisional ya que solamente el admin va poder crear proveedores
userRouters.post('/admin/provider-register', providerController.providerRegister);
userRouters.post('/store', storeController.registerInStore);
userRouters.post('/login', loginController.login);
userRouters.get('/profile', checkAuth, profileController.findProfile);

//routers.get()

export default userRouters;
