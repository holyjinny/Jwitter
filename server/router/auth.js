import express from 'express';
import { } from 'express-async-errors';
import * as authController from '../controller/auth.js';
import * as authValidator from '../middleware/auth-validator.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @method POST
 * @api /auth/signup
 * @access public
 * @description 회원 가입
 */
router.post('/signup', authValidator.signup, authController.signup);

/**
 * @method POST
 * @api /auth/login
 * @access public
 * @description 로그인
 */
router.post('/login', authValidator.login, authController.login);

/**
 * @method GET
 * @api /auth/me
 * @access public
 * @description 유효한 유저인지 확인
 */
router.get('/me', isAuth, authController.me);

export default router;