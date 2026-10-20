const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const mailOptions = {
        from: `"Fhobs Solutions" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };
    await transporter.sendEmail(mailOptions);
};

module.exports = sendEmail;