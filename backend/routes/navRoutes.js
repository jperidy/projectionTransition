const express = require('express');
const { getNavBar, updateNavBar } = require('../controllers/navControllers');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getNavBar)
    .post(protect, updateNavBar);

module.exports = router;