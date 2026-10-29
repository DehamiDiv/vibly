import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

export const sendNotificationEmail = async ({ to, subject, html }) => {
    if (!transporter) {
        console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
        return { success: true, mocked: true };
    }

    return await transporter.sendMail({
        from: process.env.SENDER_EMAIL || '"PingUp" <noreply@pingup.com>',
        to,
        subject,
        html,
    });
};

export default transporter;

