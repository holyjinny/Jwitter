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
 * @description 트윗 작성 시 유효성 검사
 */
export const createTweet = [
    body('text').notEmpty().withMessage('메세지를 입력해주세요!'),
    validate,
]

/**
 * @access public
 * @description 트윗 수정 시 유효성 검사
 */
export const updateTweet = [
    body('text').notEmpty().withMessage('메세지를 입력해주세요!'),
    validate,
]