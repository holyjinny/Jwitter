import SQ from 'sequelize';
import { config } from '../config/config.js';

const { host, user, database, password } = config.db;

export const sequelize = new SQ.Sequelize(database, user, password, {
    host,
    dialect: 'mysql',
    logging: false,
});