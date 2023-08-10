const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorhandler');
const NotFoundError = require('./utils/notFoundError');
const { createUser, login } = require('./controllers/users');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
mongoose.set('strictQuery', false);

const PORT = 3000;
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:;/~+#-]*[\w@?^=%&/~+#-])?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => next(new NotFoundError('страница не найдена')));

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server is started on port:', PORT);
});
