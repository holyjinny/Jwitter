import Mongoose from 'mongoose';
import { useVirtualId } from "../db/database.js";

const userSchema = new Mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    url: String,
});

useVirtualId(userSchema);

const User = Mongoose.model('User', userSchema);

export async function findByUsername(username) {
    return User.findOne({ username });
}

export async function findById(id) {
    return User.findById(id);
}

/**
 * @method POST
 * @api /auth/signup
 * @access public
 * @description 회원 가입
 */
export async function createUser(user) {
    return new User(user)
        .save()
        .then((data) => data.id);
}