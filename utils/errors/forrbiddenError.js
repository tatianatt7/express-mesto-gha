const {
  HTTP_STATUS_FORBIDDEN,
  MESSAGE_ERROR_FORBIDDEN_DELETE,
} = require('../constants');

class ForbiddenError extends Error {
  constructor(message = MESSAGE_ERROR_FORBIDDEN_DELETE) {
    super(message);
    this.statusCode = HTTP_STATUS_FORBIDDEN;
  }
}

module.exports = {
  ForbiddenError,
};
