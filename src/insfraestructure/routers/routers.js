import routers from './appRoutes';

export default (app) => {
    app.use('/api/user', routers);
    app.use('/api/admin', routers);
};
