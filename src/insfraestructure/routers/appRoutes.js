import express from 'express';

import usersController from '../controllers/users/usersController';
import productController from '../controllers/product/productController';
import providerController from '../controllers/provider/providerController';
import storeController from '../controllers/store/storeController';
import loginController from '../controllers/login/loginController';
import profileController from '../controllers/profiles/profileController';
import {
    checkAuth,
    isCorrectHost,
    isAdmin,
    existAsEmployee,
    existAsAdmin,
} from '../../domine/middlewares/auth';

const userRouters = express.Router();

//Register Routes
userRouters.post('/user/users-register', usersController.registerUsers);
userRouters.post('/admin/admin-register', existAsEmployee, usersController.registerUsers);
userRouters.post(
    '/employee/employee-register',
    isCorrectHost,
    isAdmin,
    existAsAdmin,
    usersController.registerEmployee,
);
userRouters.post(
    '/admin/provider-register',
    isCorrectHost,
    isAdmin,
    providerController.providerRegister,
);

userRouters.post('/products-register', productController.createProduct);
userRouters.post('/store', storeController.registerInStore);

//Login Routes
userRouters.post('/login', isCorrectHost, loginController.login);
userRouters.post('/company/login', isCorrectHost, loginController.loginAdmin);

// Profile Routes
userRouters.get('/profile', isCorrectHost, checkAuth, profileController.findUsersProfile);
userRouters.get(
    '/employee/profile',
    isCorrectHost,
    checkAuth,
    profileController.findEmployeeProfile,
);
//
// //routers.get()
//
// userRouters.get(
//     '/admin/profile',
//     isCorrectHost,
//     checkAuth,
//     isAdmin,
//     profileController.findProfile,
// );
// userRouters.get(
//     '/provider/profile',
//     isCorrectHost,
//     checkAuth,
//     isAdmin,
//     profileController.findProfile,
// );

export default userRouters;
