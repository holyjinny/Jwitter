import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ message: errors.array()[0].msg });
};

/**
 * @access public
 * @description 회원가입 시 유효성 검사
 */
export const signup = [
    body('name').notEmpty().withMessage('이름은 공백일 수 없습니다.'),
    body('email').isEmail().normalizeEmail().withMessage('유효한 이메일 형식이 아닙니다.'),
    body('url')
        .isURL()
        .withMessage('유효하지 않은 URL 형식입니다.')
        .optional({ nullable: true, checkFalsy: true }),
    validate,
]

/**
 * @access public
 * @description 로그인 시 유효성 검사
 */
export const login = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('아이디를 입력해주세요.'),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('비밀번호는 5글자 이상입니다.'),
    validate,
]