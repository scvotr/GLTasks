const nodemailer = require('nodemailer');

require("dotenv").config()
const MAIL_USER = process.env.MAIL_USER
const MAIL_PASS = process.env.MAIL_PASS

const sendEmailToUser = async() => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'mail.nic.ru',
      port: 587,
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    const mailOptions = {
      from: `"The Idea project" <${MAIL_USER}`,
      to: 'it.ae@geliopax.ru', // Уберите угловые скобки из адреса получателя
      subject: 'Send message from project',
      text: 'Hello',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error occurred while sending email:', error);
  }
}

// Вызов функции для отправки письма
sendEmailToUser();