const { ValidationError } = require('mongoose').Error;
const Card = require('../models/card');
const BadRequestError = require('../utils/badRequestError');
const ForbiddenError = require('../utils/forbiddenError');
const NotFoundError = require('../utils/notFoundError');

const {
  HTTP_STATUS_CREATED,
  MESSAGE_ERROR_NOT_VALID,
  MESSAGE_ERROR_CARD_NOT_FOUND,
  MESSAGE_ERROR_FORBIDDEN,
} = require('../utils/constants');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_STATUS_CREATED).send({ data: card }))
    .catch((error) => {
      if (error instanceof ValidationError) {
        return next(new BadRequestError(MESSAGE_ERROR_NOT_VALID));
      }

      return next(error);
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((error) => next(error));
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userID } = req.user;

  Card.findById(cardId)
    .orFail(new NotFoundError(MESSAGE_ERROR_CARD_NOT_FOUND))
    .then((card) => {
      if (!card.owner.toString(userID)) {
        return next(new ForbiddenError(MESSAGE_ERROR_FORBIDDEN));
      }

      return Card.findByIdAndRemove(cardId)
        .then(() => {
          res.send({ data: {} });
        })
        .catch(next);
    })
    .catch(next);
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new NotFoundError(MESSAGE_ERROR_CARD_NOT_FOUND))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new NotFoundError(MESSAGE_ERROR_CARD_NOT_FOUND))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  putLike,
  deleteLike,
};
