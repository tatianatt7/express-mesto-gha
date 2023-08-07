const { CastError, ValidationError } = require('mongoose').Error;
const Card = require('../models/card');

const NotFoundError = require('../utils/notFoundError');

const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  MESSAGE_ERROR_NOT_VALID,
  MESSAGE_ERROR_CAST,
  MESSAGE_ERROR_SERVER,
  MESSAGE_ERROR_CARD_NOT_FOUND,
} = require('../utils/constants');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: MESSAGE_ERROR_NOT_VALID });
      }

      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: MESSAGE_ERROR_SERVER });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGE_ERROR_SERVER }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(new NotFoundError(MESSAGE_ERROR_CARD_NOT_FOUND))
    .then(() => {
      res.send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: err.message });
      }
      if (err instanceof CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: MESSAGE_ERROR_CAST });
      }
      if (err instanceof ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: MESSAGE_ERROR_NOT_VALID });
      }

      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: MESSAGE_ERROR_SERVER });
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new NotFoundError(MESSAGE_ERROR_CARD_NOT_FOUND))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: err.message });
      }
      if (err instanceof CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: MESSAGE_ERROR_CAST });
      }
      if (err instanceof ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: MESSAGE_ERROR_NOT_VALID });
      }

      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: MESSAGE_ERROR_SERVER });
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new NotFoundError(MESSAGE_ERROR_CARD_NOT_FOUND))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: MESSAGE_ERROR_CAST });
      }
      if (err instanceof NotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: err.message });
      }

      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: MESSAGE_ERROR_SERVER });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  putLike,
  deleteLike,
};
