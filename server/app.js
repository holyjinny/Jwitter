import express from 'express';
import { } from 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { config } from './config/config.js';
import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import { initSocket } from './connection/socket.js';
import { db } from './db/database.js';

const app = express();

/**
 * @description 미들웨어
 */
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

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
 * @description DB
 */
db.getConnection()
    .then((connection) => console.log(`DATABASE: ${config.db.database}, HOST: ${config.db.host}`))
    .catch((error) => console.error(`서버를 시작할 수 없습니다. ${error}`));

/**
 * @description 서버 실행
 */
const server = app.listen(config.host.port);

/**
 * @description 소켓
 */
initSocket(server);