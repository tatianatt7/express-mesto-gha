const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  MESSAGE_ERROR_SERVER,
} = require('../utils/constants');

const errorHandler = (err, _, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR
      ? MESSAGE_ERROR_SERVER
      : message,
    statusCode,
    raw: message,
  });
  next();
};

module.exports = errorHandler;
