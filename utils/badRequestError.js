const { HTTP_STATUS_BAD_REQUEST } = require('./constants');

class BadRequestError extends Error {
  constructor(message = 'BadRequest') {
    super(message);
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
