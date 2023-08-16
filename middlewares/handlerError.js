const { ValidationError, CastError } = require('mongoose').Error;
const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  MESSAGE_ERROR_SERVER,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CONFLICT,
  MESSAGE_ERROR_CAST,
} = require('../utils/constants');
const { ConflictError, BadRequestError } = require('../utils/errors');

module.exports = (err, _, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  if (err instanceof ValidationError) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send(err);
  }

  if (err.code === 11000) {
    return res.status(HTTP_STATUS_CONFLICT).send(new ConflictError());
  }

  if (err instanceof CastError) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send(new BadRequestError(MESSAGE_ERROR_CAST));
  }

  res.status(statusCode).send({
    message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR
      ? MESSAGE_ERROR_SERVER
      : message,
    statusCode,
    raw: message,
  });

  return next();
};
