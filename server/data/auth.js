import MongoDB from 'mongodb';
import { getUsers } from "../db/database.js";

const ObjectId = MongoDB.ObjectId;

export async function findByUsername(username) {
    return getUsers()
        .findOne({ username })
        .then(mapOptionalUser);
}

export async function findById(id) {
    return getUsers()
        .findOne({ _id: new ObjectId(id) })
        .then(mapOptionalUser);
}

/**
 * @method POST
 * @api /auth/signup
 * @access public
 * @description 회원 가입
 */
export async function createUser(user) {
    return getUsers()
        .insertOne(user)
        .then((data) => data.insertedId.toString());
}

function mapOptionalUser(user) {
    return user ? { ...user, id: user._id.toString() } : user;
}