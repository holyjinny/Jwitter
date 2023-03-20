import MongoDB from 'mongodb';
import { getTweets } from "../db/database.js";
import * as userRepository from '../data/auth.js';

const ObjectId = MongoDB.ObjectId;

/**
 * @method GET
 * @api /tweets
 * @access public
 * @description 모든 트윗 불러오기
 */
export async function getAll() {
    return getTweets()
        .find()
        .sort({ createdAt: -1 })
        .toArray()
        .then(mapTweets);
}

/**
 * @method GET
 * @api /tweets?username=:username
 * @access public
 * @description 해당하는 유저의 트윗 불러오기
 */
export async function getAllByUsername(username) {
    return getTweets()
        .find({ username })
        .sort({ createdAt: -1 })
        .toArray()
        .then(mapTweets);
}

/**
 * @method GET
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 불러오기
 */
export async function getByid(id) {
    return getTweets()
        .findOne({ _id: new ObjectId(id) })
        .then(mapOptionalTweet);
}

/**
 * @method POST
 * @api /tweets
 * @access public
 * @description 트윗 작성하기
 */
export async function create(text, userId) {
    const { name, username, url } = await userRepository.findById(userId);
    const tweet = {
        text,
        createdAt: new Date(),
        userId,
        username: username,
        name: name,
        url: url,
    };
    return getTweets()
        .insertOne(tweet)
        .then((data) => mapOptionalTweet({ ...tweet, _id: data.insertedId }));
}

/**
 * @method PUT
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 수정하기
 */
export async function update(id, text) {
    return getTweets()
        .findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { text } },
            { returnDocument: 'after' },
        )
        .then((result) => result.value)
        .then(mapOptionalTweet);
}

/**
 * @method DELETE
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 삭제하기
 */
export async function remove(id) {
    return getTweets()
        .deleteOne({ _id: new ObjectId(id) });
}

function mapOptionalTweet(tweet) {
    return tweet ? { ...tweet, id: tweet._id.toString() } : tweet;
}

function mapTweets(tweets) {
    return tweets.map(mapOptionalTweet);
}