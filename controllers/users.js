const User = require('../models/user');
const NotFoundError = require('../utils/notFoundError');
const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'ошибка сервера' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError())
    .then((foundUser) => res.send({ data: foundUser }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с таким ID не найден' });
      } else if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Неверный ID пользователя' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректные данные' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError())
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный ID пользователя' });
      } else if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректные данные' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateProfileAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError())
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный ID пользователя' });
      } else if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректные данные' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateProfileAvatar,
};
