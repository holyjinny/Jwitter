import express from 'express';
import { } from 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/config.js';
import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import { initSocket } from './connection/socket.js';
import { sequelize } from './db/database.js';
import { csrfCheck } from './middleware/csrf.js';

const app = express();

const corsOption = {
    origin: config.cors.allowedOrigin,
    optionsSuccessStatus: 200,
    credentials: true,
};

/**
 * @description 미들웨어
 */
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan('tiny'));
app.use(csrfCheck);

/**
 * @description 라우터
 */
app.use('/tweets', tweetsRouter);
app.use('/auth', authRouter);

/**
 * @deprecated 404
 */
app.use((req, res, next) => {
    res.sendStatus(404);
});

/**
 * @description 에러 처리
 */
app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});

/**
 * @description Sequelize 연결 및 실행
 */
sequelize.sync().then(() => {
    console.log(`Server is started.... ${new Date()}`);
    const server = app.listen(config.port);
    initSocket(server);
});