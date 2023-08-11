const { HTTP_STATUS_UNAUTHORIZED, MESSAGE_ERROR_UNAUTHORIZED } = require('./constants');

class UnauthorizedError extends Error {
  constructor(message = MESSAGE_ERROR_UNAUTHORIZED) {
    super(message);
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
