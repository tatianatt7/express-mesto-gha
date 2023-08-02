const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
const PORT = 3000;

app.use((req, res, next) => {
  req.user = {
    _id: '64ca88aea18d8b2692ea1179', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'неизвестная ошибка' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server is started on port:', PORT);
});
