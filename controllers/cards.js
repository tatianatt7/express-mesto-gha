const Card = require('../models/card');

const NotFoundError = require('../utils/notFoundError');

const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CREATED,
} = require('../utils/constants');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка сервера' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(new NotFoundError('Карточка с указанным ID не найдена'))
    .then(() => {
      res.send({ message: 'Карточка успешно удалена' });
    })
    .catch(() => res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка сервера' }));
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError('Карточка с указанным ID не найдена'))
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new NotFoundError('Карточка с указанным ID не найдена'))
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  putLike,
  deleteLike,
};
