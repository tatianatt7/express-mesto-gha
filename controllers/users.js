const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//
const { JWT_TOKEN_KEY } = require('../utils/constants');
const User = require('../models/user');
const {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require('../utils/errors');

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError())
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
      if (err.code === 11000) {
        return next(new ConflictError());
      }

      return next(err);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError())
    .then((user) => res.send(user))
    .catch(next);
};

const updateProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError())
    .then((user) => res.send(user))
    .catch(next);
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_TOKEN_KEY, { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true });

      return res.send({ token });
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
