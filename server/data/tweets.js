import { db } from '../db/database.js';

const SELECT_JOIN = 'SELECT tw.id, tw.text, tw.createdAt, tw.userId, us.username, us.name, us.url  FROM tweets as tw JOIN users as us ON tw.userId = us.id';
const ORDER_DESC = 'ORDER BY tw.createdAt DESC';

/**
 * @method GET
 * @api /tweets
 * @access public
 * @description 모든 트윗 불러오기
 */
export async function getAll() {
    return db
        .execute(`${SELECT_JOIN} ${ORDER_DESC}`)
        .then((result) => result[0]);
}

/**
 * @method GET
 * @api /tweets?username=:username
 * @access public
 * @description 해당하는 유저의 트윗 불러오기
 */
export async function getAllByUsername(username) {
    return db
        .execute(`${SELECT_JOIN} WHERE username=? ${ORDER_DESC}`, [username])
        .then((result) => result[0]);
}

/**
 * @method GET
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 불러오기
 */
export async function getByid(id) {
    return db
        .execute(`${SELECT_JOIN} WHERE tw.id=?`, [id])
        .then((result) => result[0][0]);
}

/**
 * @method POST
 * @api /tweets
 * @access public
 * @description 트윗 작성하기
 */
export async function create(text, userId) {
    return db
        .execute('INSERT INTO tweets (text, createdAt, userId) VALUES(?, ?, ?)', [text, new Date(), userId])
        .then((result) => getByid(result[0].insertId));
}

/**
 * @method PUT
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 수정하기
 */
export async function update(id, text) {
    return db
        .execute('UPDATE tweets SET text=? WHERE id=?', [text, id])
        .then(() => getByid(id));
}

/**
 * @method DELETE
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 삭제하기
 */
export async function remove(id) {
    return db.execute('DELETE FROM tweets WHERE id=?', [id]);
}