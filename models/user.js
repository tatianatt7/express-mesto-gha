const { Schema, model } = require('mongoose');
// const validator = require('validator');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле "about" должно быть заполнено'],
    maxlenght: [30, 'Максимальная длина поля "about" - 30'],
    minlenght: [2, 'Минимальная длина поля "about" - 2'],
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = model('user', userSchema);