const express = require('express');
const { sendContactFormEmail } = require('../controllers/emailsControllers');

const router = express.Router();

router.route('/contact')
    .post(sendContactFormEmail);
    
module.exports = router;