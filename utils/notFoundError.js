const { HTTP_STATUS_NOT_FOUND } = require('./constants');

class NotFoundError extends Error {
  constructor(message = 'Not Found') {
    super(message);
    this.statusCode = HTTP_STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundError;
