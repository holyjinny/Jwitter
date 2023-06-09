import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { } from 'express-async-errors'
import { config } from '../config/config.js';
import * as userRepository from '../data/auth.js';

const jwtSecretKey = config.jwt.secretKey;
const jwtExpiresInDays = config.jwt.expiresInSec;
const bcryptSaltRounds = config.bcrypt.saltRounds;

function createJwtToken(id) {
    return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}

/**
 * @method POST
 * @api /auth/signup
 * @access public
 * @description 회원 가입
 */
export async function signup(req, res) {
    const { username, password, name, email, url } = req.body;
    const found = await userRepository.findByUsername(username);

    if (found) {
        return res.status(409).json({ message: `${username}이 이미 존재합니다.` });
    }
    const hashed = await bcrypt.hash(password, bcryptSaltRounds);
    const userId = await userRepository.createUser({
        username,
        password: hashed,
        name,
        email,
        url,
    });

    const token = createJwtToken(userId);
    res.status(201).json({ token, username });
}

/**
 * @method POST
 * @api /auth/login
 * @access public
 * @description 로그인
 */
export async function login(req, res) {
    const { username, password } = req.body;
    const user = await userRepository.findByUsername(username);

    if (!user) {
        return res.status(401).json({ message: '아이디 또는 비밀번호를 다시 한번 확인해주세요.' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(401).json({ message: '아이디 또는 비밀번호를 다시 한번 확인해주세요.' })
    }

    const token = createJwtToken(user.id);
    res.status(200).json({ token, username });
}

/**
 * @method GET
 * @api /auth/me
 * @access public
 * @description 유효한 유저인지 확인
 */
export async function me(req, res, next) {
    const user = await userRepository.findById(req.userId);

    if (!user) {
        return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    }
    res.status(200).json({ token: req.token, username: user.username });
}