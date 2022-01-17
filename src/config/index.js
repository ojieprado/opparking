/**
 * Config File
 * author: oprado
 */
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	mongodb: process.env.MONGODB,
	port: process.env.PORT,
	tokenKey: process.env.TOKENKEY,
	username: 'oprado',
	password: 'thisIsMyPassword'
}