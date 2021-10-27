const express = require('express');
const { getFonts, updateFont, deleteFont } = require('../controllers/fontControllers');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getFonts)
    .post(protect, updateFont);
    
router.route('/:id')
    .delete(protect, deleteFont);
    
module.exports = router;