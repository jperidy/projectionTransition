import MailService from '../../../services/emails/MailService';

import config from '../../../config.json';

/** @type {import('./__types/[id]').RequestHandler} */
export async function post({ request: req }) {
    const email = await req.json();

    const typeContact = email.type;
    let sendTo = config.CONTACT_EMAIL;
    if (typeContact === 'dev') {
        sendTo = config.DEV_EMAIL;
    }

    const mailInfo = {
        to: sendTo,
        subject: 'Contact web // ' + email.subject,
        template: "contactEmail",
        context: {
            email: email.email,
            body: email.body.split('\n'),
            subject: email.subject,
            nom: email.nom,
            prenom: email.prenom
        }
    };
    const mailService = new MailService(
        config.MAIL_HOST,
        config.MAIL_PORT,
        config.MAIL_USER,
        config.MAIL_PASS
    );
    await mailService.sendMail(mailInfo);

    return {
        status: 200,
        body: { message: 'Mail envoyé' }
    }
}