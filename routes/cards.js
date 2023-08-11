const router = require('express').Router();

const {
  createCard,
  getCards,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');
const { validateCardId } = require('../utils/validator');

router.post('/', createCard);

router.get('/', getCards);

router.delete('/:cardId', validateCardId, deleteCard);

router.put('/:cardId/likes', validateCardId, putLike);

router.delete('/:cardId/likes', validateCardId, deleteLike);

module.exports = router;
