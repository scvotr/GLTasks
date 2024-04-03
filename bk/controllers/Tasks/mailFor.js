const nodemailer = require('nodemailer');

const transpoter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'stasforeva23@mail.ru',
        pass: 'pass',
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const mailOptions = {
  from: '"The Idea project" <stasforeva23@mail.ru>',
    to: '<it.ae@geliopax.ru>',
    subject: 'Send message from project',
    text: 'Hello',
};

transpoter.sendMail(mailOptions, (err, info) => {
    console.log(err, info);
});



// const transporter = nodemailer.createTransport({
//   // настройки для вашего почтового сервера
//   host: 'smtp.mail.ru',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'mail@mail.ru',
//     pass: 'pass',
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// const sendMail = async (recipient, subject, message) => {
//   try {
//     await transporter.sendMail({
//       from: '<mail.mailru>', // ваш адрес электронной почты
//       to: recipient,
//       subject: subject,
//       text: message,
//     });
//     console.log('Письмо успешно отправлено');
//   } catch (error) {
//     console.error('Ошибка отправки письма:', error);
//   }
// };