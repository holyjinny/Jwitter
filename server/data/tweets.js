import * as userRepository from './auth.js';

let tweets = [];
// let tweets = [
//     {
//         id: '1',
//         text: '트윗 테스트',
//         createdAt: new Date().toString(),
//         userId: '1',
//     },
// ];

/**
 * @method GET
 * @api /tweets
 * @access public
 * @description 모든 트윗 불러오기
 */
export async function getAll() {
    return Promise.all(
        tweets.map(async (tweet) => {
            const { username, name, url } = await userRepository.findById(tweet.userId);
            return { ...tweet, username, name, url };
        })
    );
}

/**
 * @method GET
 * @api /tweets?username=:username
 * @access public
 * @description 해당하는 유저의 트윗 불러오기
 */
export async function getAllByUsername(username) {
    return getAll().then((tweets) => tweets.filter((tweet) => tweet.username === username));
}

/**
 * @method GET
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 불러오기
 */
export async function getByid(id) {
    const found = tweets.find((tweet) => tweet.id === id);
    if (!found) {
        return null;
    }

    const { username, name, url } = await userRepository.findById(found.userId);
    return { ...found, username, name, url };
}

/**
 * @method POST
 * @api /tweets
 * @access public
 * @description 트윗 작성하기
 */
export async function create(text, userId) {
    const tweet = {
        id: Date.now().toString(),
        text,
        createdAt: new Date(),
        userId,
    };
    tweets = [tweet, ...tweets];
    return getByid(tweet.id);
}

/**
 * @method PUT
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 수정하기
 */
export async function update(id, text) {
    const tweet = tweets.find((tweet) => tweet.id === id);
    if (tweet) {
        tweet.text = text;
    }
    return getByid(tweet.id);
}

/**
 * @method DELETE
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 삭제하기
 */
export async function remove(id) {
    return tweets.filter((tweet) => tweet.id !== id);
}