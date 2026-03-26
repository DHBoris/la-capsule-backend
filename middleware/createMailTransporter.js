const nodemailer = require("nodemailer");
require('dotenv').config();

const createMailTransporter = () => {
    const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
    });

    return transporter;
};

module.exports = {createMailTransporter}
