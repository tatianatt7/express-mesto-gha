const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/unauthorizedError');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  let token;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else {
      return next(new UnauthorizedError());
    }
  } else {
    token = authorization.replace('Bearer ', '');
  }

  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret-key');
  } catch (err) {
    return next(new UnauthorizedError());
  }

  req.user = payload; // записываем пэйлоуд в объект запроса

  return next();
};
