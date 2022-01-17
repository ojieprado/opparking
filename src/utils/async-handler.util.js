/**
 * Express Controller handler
 * @param {Function} fx Express Middleware
 * @returns 
 */
 const asyncCatch = (fx) => (req, res, next) => {
    Promise.resolve(fx(req, res, next)).catch((err) => next(err));
}

module.exports = asyncCatch;
