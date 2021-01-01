import routers from './appRoutes';

export default (app) => {
    app.use('/api/users', routers);
    app.use('/api/admin', routers);
};
