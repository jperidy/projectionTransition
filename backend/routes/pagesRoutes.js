const express = require('express');
const { getPageContent, updatePageContent } = require('../controllers/pagesControllers');
const router = express.Router();

router.route('/:name')
    .get(getPageContent)
    .post(updatePageContent);


module.exports = router;
