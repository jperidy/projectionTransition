const express = require('express');
const { getArticleContent, updateArticleContent, createArticle, getAllArticlesContent, deleteArticleContent } = require('../controllers/articleControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:id')
    .get(getArticleContent)
    .put(protect, updateArticleContent)
    .delete(protect, deleteArticleContent)

router.route('/')
    .get(getAllArticlesContent)
    .post(protect, createArticle);

module.exports = router;
