import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import * as fse from 'fs-extra';

import authRouter from './routes/auth.route.js';
import mangaRouter from './routes/manga.route.js';

const app: Application = express();

app.use(logger('dev'));
app.use(cors({ origin: true }));
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/manga', mangaRouter);

fse.emptyDir('./public/images', err => {
    if (err) return console.error(err)
});
fse.copy('./backup_images', './public/images', err => {
    if (err) return console.error(err)
});

export default app;
