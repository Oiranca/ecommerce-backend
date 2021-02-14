import express from 'express';
import usersController from '../controllers/users/usersController';
import productController from '../controllers/product/productController';
import providerController from '../controllers/provider/providerController';
import storeController from '../controllers/store/storeController';
import loginController from '../controllers/login/loginController';
import profileController from '../controllers/profiles/profileController';
import { middlewares } from '../../domine/middlewares/auth';
import * as path from 'path';

const userRouters = express.Router();

//Register Routes
userRouters.post('/user/users-register', usersController.registerUsers);
userRouters.post(
    '/admin/admin-register',
    middlewares.existAsEmployee,
    usersController.registerUsers,
);

/*Sólo el administrador puede crear al empleado y al provider*/
userRouters.post(
    '/employee/employee-register',
    middlewares.isCorrectHost,
    middlewares.isAdmin,
    middlewares.existAsAdmin,
    usersController.registerEmployee,
);
userRouters.post(
    '/admin/provider-register',
    middlewares.isCorrectHost,
    middlewares.isAdmin,
    providerController.providerRegister,
);

userRouters.post('/products-register', productController.createProduct);
userRouters.post('/store', storeController.registerInStore);

//Login Routes
userRouters.post('/login', middlewares.isCorrectHost, loginController.login);
userRouters.post('/company/login', middlewares.isCorrectHost, loginController.loginAdmin);

// Profile Routes
userRouters.post(
    '/admin/employee-profile',
    middlewares.isCorrectHost,
    middlewares.checkAuth,
    middlewares.isAdmin,
    profileController.findEmployeeProfile,
);

userRouters.get(
    '/profile',
    middlewares.isCorrectHost,
    middlewares.checkAuth,
    profileController.findUsersProfile,
);

userRouters.get(
    '/employee/profile',
    middlewares.isCorrectHost,
    middlewares.checkAuth,
    profileController.findEmployeeProfile,
);

userRouters.get(
    '/admin/profile',
    middlewares.isCorrectHost,
    middlewares.checkAuth,
    middlewares.isAdmin,
    profileController.findAdminProfile,
);

//Update Profile

userRouters.post(
    '/admin/update-profile',
    middlewares.isCorrectHost,
    middlewares.checkAuth,
    middlewares.isAdmin,
    profileController.usersUpdateProfile,
);

userRouters.post(
    '/update-profile',
    middlewares.isCorrectHost,
    middlewares.checkAuth,
    profileController.usersUpdateProfile,
);

userRouters.post(
    '/employee/update-profile',
    middlewares.isCorrectHost,
    middlewares.checkAuth,
    profileController.usersUpdateProfile,
);

export default userRouters;
