import userRouters from './appRoutes';

export default (app) => {
    app.use('/api/users', userRouters);
    app.use('/api/admin', userRouters);
    app.use('/api/product', userRouters);
};
