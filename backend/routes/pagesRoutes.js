const express = require('express');
const { getPageContent, updatePageContent, getAllPages, createPage, deleteOnePage, duplicatePage, updatePage } = require('../controllers/PagesControllers');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createPage);
    
router.route('/list')
    .get(protect, getAllPages);
    
router.route('/duplicate')
    .post(protect, duplicatePage);
    
router.route('/:name')
    .get(getPageContent)
    .post(protect, updatePageContent)
    .put(protect, updatePage)
    .delete(protect, deleteOnePage);

module.exports = router;
