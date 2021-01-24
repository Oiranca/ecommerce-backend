import routers from './appRoutes';

export default (app) => {
    app.use('/api', routers);
};
