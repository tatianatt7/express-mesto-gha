const { HTTP_STATUS_FORBIDDEN } = require('./constants');

class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.statusCode = HTTP_STATUS_FORBIDDEN;
  }
}
module.exports = ForbiddenError;
