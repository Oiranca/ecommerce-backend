import express from 'express';
import dotEnv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routers from './insfraestructure/routers/routers';

const app = express();
dotEnv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routers(app);

const init = async () => {
    await mongoose.connect(process.env.MONGO, {
        dbName: 'ecommerce',
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
};
init()
    .then(() => {
        console.log('Connected to Mongodb');
        app.listen(process.env.PORT);
    })
    .catch((e) => console.log('Mongodb error', e));
