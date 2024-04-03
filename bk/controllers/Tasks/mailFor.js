const nodemailer = require('nodemailer');
const { getEmailQ } = require('../../Database/queries/User/userQuery');

// Функция для отправки электронной почты
const sendEmail = async(user_id) => {

  console.log('sendEmail', user_id)

  const email = await getEmailQ(user_id)
  console.log(email)

  // try {
  //   const transporter = nodemailer.createTransport({
  //     host: 'smtp.mail.ru',
  //     port: 465,
  //     secure: true,
  //     auth: {
  //       user: 'stasforeva23@mail.ru',
  //       pass: '36abwseVfHpjJRPHDnZ3',
  //     },
  //     tls: {
  //       rejectUnauthorized: false,
  //     },
  //   });

  //   const mailOptions = {
  //     from: '"The Idea project" <stasforeva23@mail.ru>',
  //     to: 'it.ae@geliopax.ru', // Уберите угловые скобки из адреса получателя
  //     subject: 'Send message from project',
  //     text: 'Hello',
  //   };

  //   const info = await transporter.sendMail(mailOptions);
  //   console.log('Email sent:', info.response);
  // } catch (error) {
  //   console.error('Error occurred while sending email:', error);
  // }
}

// Вызов функции для отправки письма
sendEmail();

module.exports ={
  sendEmail,
}
// !--------------------------------------
// const transpoter = nodemailer.createTransport({
//     host: 'smtp.mail.ru',
//     port: 465,
//     secure: true,
//     auth: {
//         user: 'stasforeva23@mail.ru',
//         pass: '36abwseVfHpjJRPHDnZ3',
//     },
//     tls: {
//         rejectUnauthorized: false,
//     },
// });

// const mailOptions = {
//   from: '"The Idea project" <stasforeva23@mail.ru>',
//     to: '<it.ae@geliopax.ru>',
//     subject: 'Send message from project',
//     text: 'Hello',
// };

// transpoter.sendMail(mailOptions, (err, info) => {
//     console.log(err, info);
// });



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