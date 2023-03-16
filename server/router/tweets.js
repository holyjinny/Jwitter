import express from 'express';
import { } from 'express-async-errors';
import * as tweetController from '../controller/tweets.js';
import * as tweetValidator from '../middleware/tweet-validator.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @method GET
 * @api1 /tweets
 * @api2 /tweets?username=:username
 * @access public
 * @description 모든 트윗 불러오기 / 해당하는 유저의 트윗 불러오기
 */
router.get('/', isAuth, tweetController.getTweets);

/**
 * @method GET
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 불러오기
 */
router.get('/:id', isAuth, tweetController.getTweet);

/**
 * @method POST
 * @api /tweets
 * @access public
 * @description 트윗 작성하기
 */
router.post('/', isAuth, tweetValidator.createTweet, tweetController.createTweet);

/**
 * @method PUT
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 수정하기
 */
router.put('/:id', isAuth, tweetValidator.updateTweet, tweetController.updateTweet);

/**
 * @method DELETE
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 삭제하기
 */
router.delete('/:id', isAuth, tweetController.deleteTweet);

export default router;