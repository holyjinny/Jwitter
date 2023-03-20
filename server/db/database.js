import Mongoose from 'mongoose';
import { config } from '../config/config.js';

export async function connectDB() {
    return Mongoose.connect(config.db.host);
};

/**
* @description _id -> id로 읽어오기 및 JSON으로 변환할 때, 콘솔에 포함되도록 설정
*/
export function useVirtualId(schema) {
    schema.virtual('id').get(function () {
        return this._id.toString();
    });

    schema.set('toJSON', { virtuals: true });
    schema.set('toObject', { virtuals: true });
};

let db;

export function getTweets() {
    return db.collection('tweets');
};