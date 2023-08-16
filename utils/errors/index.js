const { BadRequestError } = require('./badRequestError');
const { ConflictError } = require('./conflictError');
const { ForbiddenError } = require('./forrbiddenError');
const { NotFoundError } = require('./notFoundError');
const { UnauthorizedError } = require('./unauthorizedError');

module.exports = {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
};
