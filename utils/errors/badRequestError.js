const {
  HTTP_STATUS_BAD_REQUEST, MESSAGE_ERROR_NOT_VALID,
} = require('../constants');

class BadRequestError extends Error {
  constructor(message = MESSAGE_ERROR_NOT_VALID) {
    super(message);
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = {
  BadRequestError,
};
