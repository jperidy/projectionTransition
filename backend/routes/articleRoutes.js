const express = require('express');
const { getArticleContent, updateArticleContent, createArticle } = require('../controllers/articleControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:id')
    .get(getArticleContent)
    .put(protect, updateArticleContent)

router.route('/').post(protect, createArticle);

module.exports = router;
