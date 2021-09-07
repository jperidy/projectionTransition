const express = require('express');
const { getFilmContent, updateFilmContent, createFilm, getAllFilmsContent, deleteFilmContent } = require('../controllers/filmControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:id')
    .get(getFilmContent)
    .put(protect, updateFilmContent)
    .delete(protect, deleteFilmContent)

router.route('/')
    .get(getAllFilmsContent)
    .post(protect, createFilm);

module.exports = router;
