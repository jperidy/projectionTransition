const express = require('express');
const { authUser, registerUser, verifyUserToken } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/verify', protect, verifyUserToken);

module.exports = router;