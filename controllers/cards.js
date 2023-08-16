const Card = require('../models/card');
const {
  ForbiddenError,
  NotFoundError,
} = require('../utils/errors');

const {
  HTTP_STATUS_CREATED,
  MESSAGE_ERROR_CARD_NOT_FOUND,
} = require('../utils/constants');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_STATUS_CREATED).send({ data: card }))
    .catch(next);
};

const getCards = (_, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((error) => next(error));
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => new NotFoundError(MESSAGE_ERROR_CARD_NOT_FOUND))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError());
      }

      return Card.findByIdAndRemove(cardId)
        .then(() => {
          res.send({ message: 'Карточка удалена' });
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
    .then((card) => res.send(card))
    .catch(next);
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new NotFoundError(MESSAGE_ERROR_CARD_NOT_FOUND))
    .then((card) => res.send(card))
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  putLike,
  deleteLike,
};
