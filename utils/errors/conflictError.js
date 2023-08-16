const {
  HTTP_STATUS_CONFLICT,
  MESSAGE_ERROR_CONFLICT,
} = require('../constants');

class ConflictError extends Error {
  constructor(message = MESSAGE_ERROR_CONFLICT) {
    super(message);
    this.statusCode = HTTP_STATUS_CONFLICT;
  }
}

module.exports = {
  ConflictError,
};
