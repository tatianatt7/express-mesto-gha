const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/unauthorizedError');

const checkAuthentif = (req, res, next) => {
  const { token } = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Небходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Небходима авторизация'));
  }
  req.user = payload; // записываем пэйлоуд в объект запроса
  return next();
};

module.exports = { checkAuthentif };
