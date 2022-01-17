/**
 * @function handleResponse
 * @param {object} res
 * @param {number} statusCode
 * @param {object} data
 */
function handleResponse(res, statusCode, data) {
	return res.status(statusCode).json(data);
}

/**
 * @function handleError
 * @param {object} res
 * @param {number} statusCode
 * @param {object} data
 */
function handleError(res, statusCode, data) {
	return res.status(statusCode).send(data);
}

module.exports = { handleResponse, handleError };