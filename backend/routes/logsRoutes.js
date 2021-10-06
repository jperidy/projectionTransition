const express = require('express');
const { getStatistics, getStatisticsParams } = require('../controllers/logControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getStatistics);
router.route('/params').get(protect, getStatisticsParams);

module.exports = router;
