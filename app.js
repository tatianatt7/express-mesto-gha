const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorhandler');
const NotFoundError = require('./utils/notFoundError');
const { createUser, login } = require('./controllers/users');
const { validateSignIn, validateSignUp } = require('./utils/validator');
const { MESSAGE_ERROR_NOT_FOUND } = require('./utils/constants');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
mongoose.set('strictQuery', false);

const PORT = 3000;
app.use(cookieParser());

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => next(new NotFoundError(MESSAGE_ERROR_NOT_FOUND)));

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => console.info('Server is started on port:', PORT));
