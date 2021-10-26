const express = require('express');
const { getFooter, updateFooter } = require('../controllers/footerControllers');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getFooter)
    .post(protect, updateFooter);

module.exports = router;