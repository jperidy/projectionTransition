const asyncHandler = require('express-async-handler');
const MailService = require("../config/MailService");
const { multipleMongooseToObj } = require("../utils/emailsFunctions");


const flatArrayTwo = (initialArray) => {
    const flatArray = [];
    for (let incr = 0; incr < initialArray.length; incr++) {
        if (initialArray[incr].length === 1) {
            flatArray.push(initialArray[incr][0])
        } else {
            for (let incr2 = 0; incr2 < initialArray[incr].length; incr2++) {
                flatArray.push(initialArray[incr][incr2])
            }
        }
    }
    return flatArray;
}

// @desc    send email from a contactForm 
// @route   POST /api/emails/contact
// @access  Public
const sendContactFormEmail = asyncHandler(async (req, res) => {

    const email = req.body;
    //const emailToSend = test ? "jprdevapp@gmail.com" : user.email; // to add others use ","
    const mailInfo = {
        to: process.env.CONTACT_EMAIL,
        subject: 'Contact web // ' + email.subject,
        template: "contactEmail",
        context: {
            email: email.email,
            body: email.body.split('\n'),
            subject: email.subject
        }
    };
    const mailService = new MailService();
    mailService.sendMail(mailInfo)
        .then(() => res.status(200).json({ message: 'Mail envoyé' }))
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: error });
        });
});

module.exports = { sendContactFormEmail };