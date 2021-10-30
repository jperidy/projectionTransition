const express = require('express');
const { getPageContent, updatePageContent, getAllPages } = require('../controllers/PagesControllers');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.route('/list')
    .get(protect, getAllPages);

router.route('/:name')
    .get(getPageContent)
    .post(protect, updatePageContent);

module.exports = router;
