const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ValidationError } = require('mongoose').Error;
//
const User = require('../models/user');
const NotFoundError = require('../utils/notFoundError');
const BadRequestError = require('../utils/badRequestError');
const ConflictError = require('../utils/conflictError');
const {
  MESSAGE_ERROR_USER_NOT_FOUND,
  MESSAGE_ERROR_NOT_VALID,
  MESSAGE_ERROR_CONFLICT,
} = require('../utils/constants');
const UnauthorizedError = require('../utils/unauthorizedError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError(MESSAGE_ERROR_USER_NOT_FOUND))
    .then((user) => res.send(user))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new UnauthorizedError())
    .then((user) => res.send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send({
      name,
      about,
      avatar,
      email,
    }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(MESSAGE_ERROR_NOT_VALID));
      } else if (err.code === 11000) {
        next(new ConflictError(MESSAGE_ERROR_CONFLICT));
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new BadRequestError(MESSAGE_ERROR_NOT_VALID));
      }
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError(err.message));
      }

      return next(err);
    });
};

const updateProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError())
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError(MESSAGE_ERROR_NOT_VALID));
      }

      return next(err);
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateProfile,
  updateProfileAvatar,
  login,
};
