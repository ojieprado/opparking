const { handleResponse, handleError } = require('../utils/response-handler.util');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user.model');

/**
 * Express: User Controller Service
 * @class UserService
 */
class UserService {

	static async login(req, res, _next) {
		const { username, password } = req.body;

		if (username === User.username && password === User.password) {
			jwt.sign({ User }, config.tokenKey, { expiresIn: '1d' }, (err, token) => {
				if (err) return handleError(res, 403, { message: `Error user` });
				return handleResponse(res, 200, { access_token: token });
			});
		} else {
			return handleError(res, 403, { message: `Unauthorized user` });
		}
	}

	static async err404(req, res, _next) {
		return handleError(res, 404, { message: `Resource not found` });
	}

	static async err500(err, req, res, next) {
		return res.status(500).render('500');
	}
}

module.exports = UserService;
