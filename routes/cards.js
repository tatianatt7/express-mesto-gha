const router = require('express').Router();

const {
  createCard,
  getCards,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');
const {
  validateCardId,
  validateCreateCard,
} = require('../utils/validator');

router.post('/', validateCreateCard, createCard);

router.get('/', getCards);

router.delete('/:cardId', validateCardId, deleteCard);

router.put('/:cardId/likes', validateCardId, putLike);

router.delete('/:cardId/likes', validateCardId, deleteLike);

module.exports = router;
