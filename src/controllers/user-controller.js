const jwt = require("jsonwebtoken");
const config = require('../config');
const { handleError } = require('../utils/response-handler.util');

function authentication(req, res, next) {
	const token =
		req.body.token ||
		req.query.token ||
		req.headers["x-access-token"] ||
		req.headers["authorization"];

	if (!token) {
		return handleError(res, 401, { message: 'A token is required for authentication' });
	}
	try {
		const decoded = jwt.verify(token, config.tokenKey);
		req.user = decoded;
	} catch (err) {
		return handleError(res, 401, { message: 'Invalid token' });
	}
	return next();
};

module.exports = authentication;