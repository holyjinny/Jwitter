import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import { } from 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config.js';
import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import { initSocket } from './connection/socket.js';
import { connectDB } from './db/database.js';
import { csrfCheck } from './middleware/csrf.js';
import rateLimit from './middleware/rate-limiter.js';

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
app.use(rateLimit);

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
 * @description MongoDB 연결 및 서버 실행
 */
connectDB()
    .then((db) => {
        console.log(`DB가 연결이 되었습니다.`);
        const server = app.listen(config.host.port);
        initSocket(server);
    })
    .catch((error) => console.error(`서버를 시작할 수 없습니다. ${error}`));