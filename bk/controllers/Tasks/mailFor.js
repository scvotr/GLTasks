const nodemailer = require('nodemailer');
const {
  getLeadEmailQ, getUserEmailQ, getGeneralEmailQ
} = require('../../Database/queries/User/userQuery');

require("dotenv").config()
const MAIL_USER = process.env.MAIL_USER
const MAIL_PASS = process.env.MAIL_PASS

const sendEmail = async (recipientEmail, text, descript) => {
  console.log('sendEmail', descript)
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
      from: `"${text}" <${MAIL_USER}>`,
      to: recipientEmail,
      subject: text,
      text: descript ? descript : text,
    };

    // const info = await transporter.sendMail(mailOptions);
    // console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error occurred while sending email:', error);
  }
}

const sendEmailToLead = async (subdepartment_id, text, fields = {}) => {
  const email = await getLeadEmailQ(subdepartment_id);
  if (email && email[0] && email[0].email_for_notify) {
    console.log('sendEmailToLead', email, text, fields.task_descript ? fields.task_descript : fields.comment);
    await sendEmail(email[0].email_for_notify, text, fields.task_descript ? fields.task_descript : fields.comment );
  } else {
    console.log('Адрес электронной почты руководителя не найден');
    throw new Error('Адрес электронной почты руководителя не найден');
  }
}

const sendEmailToGeneral = async (department_id, text, fields = {}) => {
  const email = await getGeneralEmailQ(department_id);
  if (email && email[0] && email[0].email_for_notify) {
    console.log('sendEmailToGeneral', email, text, fields.task_descript ? fields.task_descript : fields.comment);
    await sendEmail(email[0].email_for_notify, text, fields.task_descript ? fields.task_descript : fields.comment);
  } else {
    console.log('Адрес электронной почты директора не найден');
    // throw new Error('Адрес электронной почты директора не найден');
  }
}

const sendEmailToUser = async (user_id, text, fields = {}) => {
  const email = await getUserEmailQ(user_id);
  if (email && email[0] && email[0].email_for_notify) {
    console.log('sendEmailToUser', email, text, fields.task_descript ? fields.task_descript : fields.comment);
    await sendEmail(email[0].email_for_notify, text, fields.task_descript ? fields.task_descript : fields.comment);
  } else {
    console.log('Адрес электронной почты пользователя не найден');
    throw new Error('Адрес электронной почты пользователя не найден');
  }
}

module.exports = {
  sendEmailToUser,
  sendEmailToLead,
  sendEmailToGeneral,
}