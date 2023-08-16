const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const { rateLimit } = require('express-rate-limit');
const auth = require('./middlewares/auth');
const handlerError = require('./middlewares/handlerError');
const { createUser, login } = require('./controllers/users');
const { validateSignIn, validateSignUp } = require('./utils/validator');
const { NotFoundError } = require('./utils/errors');

const {
  PORT = 3000,
  MONGODB = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;

mongoose.connect(MONGODB);
mongoose.set('strictQuery', false);

const app = express();
app.use(express.json());
app.use(cookieParser());
// app.use(helmet())
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// }));

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (_, __, next) => next(new NotFoundError()));

app.use(errors());
app.use(handlerError);

app.listen(PORT, () => console.info('Server is started on port:', PORT));
