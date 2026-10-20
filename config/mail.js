const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    Service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = transporter;