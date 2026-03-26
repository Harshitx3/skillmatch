import nodemailer from 'nodemailer';

export const sendContactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL_RECIPIENT,
            subject: subject,
            text: message,
            html: `<p>${message}</p>`,
        });
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending email' });
    }
};