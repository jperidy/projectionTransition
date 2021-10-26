const express = require('express');
const { getSeo, updateSeo } = require('../controllers/seoControllers');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSeo)
    .post(protect, updateSeo);

module.exports = router;