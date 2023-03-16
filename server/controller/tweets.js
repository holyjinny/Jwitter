import { getSocketIO } from '../connection/socket.js';
import * as tweetRepository from '../data/tweets.js';

/**
 * @method GET
 * @api1 /tweets
 * @api2 /tweets?username=:username
 * @access public
 * @description 모든 트윗 불러오기 / 해당하는 유저의 트윗 불러오기
 */
export async function getTweets(req, res) {
    const username = req.query.username;
    const data = await (username ? tweetRepository.getAllByUsername(username) : tweetRepository.getAll());
    res.status(200).json(data);
}

/**
 * @method GET
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 불러오기
 */
export async function getTweet(req, res, next) {
    const id = req.params.id;
    const tweet = await tweetRepository.getByid(id);

    if (tweet) {
        res.status(200).json(tweet);
    } else {
        res.status(404).json({ message: `Tweet id(${id}) not found!!` });
    }
}

/**
 * @method POST
 * @api /tweets
 * @access public
 * @description 트윗 작성하기
 */
export async function createTweet(req, res, next) {
    const { text } = req.body;
    const tweet = await tweetRepository.create(text, req.userId);
    res.status(201).json(tweet);

    getSocketIO().emit('tweets', tweet);
}

/**
 * @method PUT
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 수정하기
 */
export async function updateTweet(req, res, next) {
    const id = req.params.id;
    const text = req.body.text;
    const tweet = await tweetRepository.getByid(id);

    if (!tweet) {
        return res.sendStatus(404);
    }

    if (tweet.userId !== req.userId) {
        return res.sendStatus(403);
    }

    const updated = await tweetRepository.update(id, text);

    res.status(200).json(updated);
}

/**
 * @method DELETE
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 삭제하기
 */
export async function deleteTweet(req, res, next) {
    const id = req.params.id;
    const tweet = await tweetRepository.getByid(id);

    if (!tweet) {
        return res.sendStatus(404);
    }

    if (tweet.userId !== req.userId) {
        return res.sendStatus(403);
    }

    await tweetRepository.remove(id);
    res.sendStatus(204);
}