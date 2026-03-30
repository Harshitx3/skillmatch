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
        console.log(`Attempting to send contact email from ${email}...`);
        await transporter.sendMail({
            from: `"${name}" <${process.env.SMTP_USER}>`, // Best practice: from should be the authenticated user
            replyTo: email, // Use replyTo for the actual sender's email
            to: process.env.EMAIL_RECIPIENT,
            subject: `Contact Form: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #6366f1;">New Contact Message</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `,
        });
        console.log("Contact email sent successfully!");
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error("Error sending contact email:", error);
        res.status(500).json({ message: 'Error sending email. Please try again later.' });
    }
};