const nodemailer = require('nodemailer')
const { getLeadEmailQ, getUserEmailQ, getGeneralEmailQ } = require('../../Database/queries/User/userQuery')

require('dotenv').config()
const MAIL_USER = process.env.MAIL_USER
const MAIL_PASS = process.env.MAIL_PASS

const sendEmail = async (recipientEmail, subject_text, body_text) => {
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
    })

    const mailOptions = {
      from: `"${subject_text}" <${MAIL_USER}>`,
      to: recipientEmail,
      subject: subject_text,
      text: body_text ? body_text : body_text,
    }

    const info = await transporter.sendMail(mailOptions)
    // console.log('Email sent:', info.response)
  } catch (error) {
    console.error('Error occurred while sending email:', error)
  }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const sendEmailToLead = async (subdepartment_id, subject_text, email_body = {}) => {
  const email = await getLeadEmailQ(subdepartment_id)
  if (email && email[0] && email[0].email_for_notify) {
    // console.log('sendEmailToLead1', email, subject_text, email_body.task_descript ? email_body.task_descript : email_body.comment)
    await sendEmail(email[0].email_for_notify, subject_text, email_body.task_descript ? email_body.task_descript : email_body.comment)
    // await delay(3000) // Задержка 3 секунды
  } else {
    console.log('Адрес электронной почты не найден Lead')
    throw new Error('Адрес электронной почты не найден Lead')
  }
}

const sendEmailToGeneral = async (department_id, subject_text, email_body = {}) => {
  const email = await getGeneralEmailQ(department_id)
  // Проверка, что email - это массив и он не пустой
  if (Array.isArray(email) && email.length > 0 && email[0] && email[0].email_for_notify) {
    // console.log('sendEmailToGeneral1', email, subject_text, email_body.task_descript ? email_body.task_descript : email_body.comment)
    await sendEmail(email[0].email_for_notify, subject_text, email_body.task_descript ? email_body.task_descript : email_body.comment)
    // await delay(3000) // Задержка 3 секунды
  } else {
    console.log('Адрес электронной почты не найден General')
    // throw new Error('Адрес электронной почты не найден General')
  }
}

const sendEmailToUser = async (user_id, subject_text, email_body = {}) => {
  const email = await getUserEmailQ(user_id)
  if (email && email[0] && email[0].email_for_notify) {
    // console.log('sendEmailToUser', email, subject_text, email_body.task_descript ? email_body.task_descript : email_body.comment)
    await sendEmail(email[0].email_for_notify, subject_text, email_body.task_descript ? email_body.task_descript : email_body.comment)
    // await delay(3000) // Задержка 3 секунды
  } else {
    console.log('Адрес электронной почты не найден User')
    // throw new Error('Адрес электронной почты не найден User')
  }
}

module.exports = {
  sendEmailToUser,
  sendEmailToLead,
  sendEmailToGeneral,
}
