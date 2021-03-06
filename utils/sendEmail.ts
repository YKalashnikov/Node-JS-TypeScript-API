import mailer from '../core/mailer';
import { SentMessageInfo } from 'nodemailer/lib/sendmail-transport';

interface SendEmailProps {
    emailFrom: string,
    emailTo: string,
    subject: string,
    html: string,
    callback?: (err: Error | null, info: SentMessageInfo) => void
}
export const sendEmail = ({
    emailFrom,
    emailTo,
    subject,
    html
}: SendEmailProps, callback?: (err: Error | null, info: SentMessageInfo) => void,) => {
    mailer.sendMail(
        {
            from: emailFrom,
            to: emailTo,
            subject: subject,
            html: html
        }
    );
}
