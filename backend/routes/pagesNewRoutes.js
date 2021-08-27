const express = require('express');
const { getPageContent, updatePageContent } = require('../controllers/PagesNewControllers');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.route('/:name')
    .get(getPageContent)
    .post(protect, updatePageContent);


module.exports = router;
