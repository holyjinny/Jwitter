import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';

const DataTypes = SQ.DataTypes;

const Sequelize = SQ.Sequelize;

const Tweet = sequelize.define(
    'tweet',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }
);

/**
 * @description 관계 정의 (FK)
 */
Tweet.belongsTo(User);

const INCLUDE_USER = {
    attributes: [
        'id', 'text', 'createdAt', 'userId',
        [Sequelize.col('user.username'), 'username'],
        [Sequelize.col('user.name'), 'name'],
        [Sequelize.col('user.url'), 'url'],
    ],
    include: {
        model: User,
        attributes: [],
    },
};

const ORDER_DESC = {
    order: [['createdAt', 'DESC']],
};

/**
 * @method GET
 * @api /tweets
 * @access public
 * @description 모든 트윗 불러오기
 */
export async function getAll() {
    return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}

/**
 * @method GET
 * @api /tweets?username=:username
 * @access public
 * @description 해당하는 유저의 트윗 불러오기
 */
export async function getAllByUsername(username) {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...ORDER_DESC,
        include: {
            ...INCLUDE_USER.include,
            where: { username },
        },
    });
}

/**
 * @method GET
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 불러오기
 */
export async function getByid(id) {
    return Tweet.findOne({
        where: { id },
        ...INCLUDE_USER,
    });
}

/**
 * @method POST
 * @api /tweets
 * @access public
 * @description 트윗 작성하기
 */
export async function create(text, userId) {
    return Tweet.create({ text, userId })
        .then((data) => this.getByid(data.dataValues.id));
}

/**
 * @method PUT
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 수정하기
 */
export async function update(id, text) {
    return Tweet.findByPk(id, INCLUDE_USER)
        .then((tweet) => {
            tweet.text = text;
            return tweet.save();
        });
}

/**
 * @method DELETE
 * @api /tweets/:id
 * @access public
 * @description 해당하는 아이디의 트윗 삭제하기
 */
export async function remove(id) {
    return Tweet.findByPk(id)
        .then((tweet) => { tweet.destroy(); });
}