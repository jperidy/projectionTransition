const express = require('express');
const { getStatistics } = require('../controllers/logControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getStatistics);

module.exports = router;
