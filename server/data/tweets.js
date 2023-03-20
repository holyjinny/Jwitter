import Mongoose from 'mongoose';
import { useVirtualId } from "../db/database.js";
import * as userRepository from '../data/auth.js';

const tweetSchema = Mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    url: String,
},
    { timestamps: true },
);

useVirtualId(tweetSchema);

const Tweet = Mongoose.model('Tweet', tweetSchema);

/**
 * @method GET
 * @api /tweets
 * @access public
 * @description 모든 트윗 불러오기
 */
export async function getAll() {
    return Tweet
        .find()
        .sort({ createdAt: -1 });
}

/**
 * @method GET
 * @api /tweets?username=:username
 * @access public
 * @description 해당하는 유저의 트윗 불러오기
 */
export async function getAllByUsername(username) {
    return Tweet
        .find({ username })
        .sort({ createdAt: -1 });
}

/**
 * @method GET
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 불러오기
 */
export async function getByid(id) {
    return Tweet.findById(id);
}

/**
 * @method POST
 * @api /tweets
 * @access public
 * @description 트윗 작성하기
 */
export async function create(text, userId) {
    return userRepository.findById(userId)
        .then((user) => new Tweet(
            {
                text,
                userId,
                username: user.username,
                name: user.name,
            }
        ).save());
}

/**
 * @method PUT
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 수정하기
 */
export async function update(id, text) {
    return Tweet.findByIdAndUpdate(id, { text }, { returnOriginal: false });
}

/**
 * @method DELETE
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 삭제하기
 */
export async function remove(id) {
    return Tweet.findByIdAndDelete(id);
}