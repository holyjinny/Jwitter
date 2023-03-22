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
 * @method POST
 * @api /auth/logout
 * @access public
 * @description 로그아웃
 */
router.post('/logout', authController.logout);

/**
 * @method GET
 * @api /auth/me
 * @access public
 * @description 유효한 유저인지 확인
 */
router.get('/me', isAuth, authController.me);

/**
 * @method GET
 * @api /auth/csrf-token
 * @access public
 * @description CSRF token 요청
 */
router.get('/csrf-token', authController.csrfToken);

export default router;