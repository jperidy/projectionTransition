const express = require('express');
const { getPageContent, updatePageContent, getAllPages, createPage, deleteOnePage } = require('../controllers/PagesControllers');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createPage);

router.route('/list')
    .get(protect, getAllPages);

router.route('/:name')
    .get(getPageContent)
    .post(protect, updatePageContent)
    .delete(protect, deleteOnePage);

module.exports = router;
