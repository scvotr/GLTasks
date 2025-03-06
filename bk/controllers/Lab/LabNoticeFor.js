'use strict'
const { socketManager } = require('../../utils/socket/socketManager')
const { sendEmailToUser } = require('../Tasks/mailFor')

const noticeForLabSystemUsersT = async (user_id, event_type, email_body) => {
  const io = socketManager.getIO()
  io.to('user_' + user_id).emit('reqForLab', { message: event_type, taskData: user_id })

  try {
    // Отправка email пользователю
    //! can remove await
    // await sendEmailToUser(user_id, event_type, email_body)
    sendEmailToUser(user_id, event_type, email_body)
      // Отправка email пользователю без ожидания
      // sendEmailToUser(user_id, text)
      .then(() => {
        // console.log('Email успешно отправлен пользователю', user_id)
      })
      .catch(error => {
        console.error('Ошибка при отправке email:', error)
        // Дополнительные действия по обработке ошибки, если необходимо
      })
  } catch (error) {
    console.error('Ошибка при отправке email:', error)
    throw new Error('Ошибка при отправке уведомления пользователю')
  }
}
// !----------------------------------------------------
const noticeForLabSystemUsersTNewCommentT = async (user_id, event_type, email_body) => {
  const io = socketManager.getIO()
  io.to('user_' + user_id).emit('reqForLabNewComment', { message: event_type, taskData: user_id })
  try {
    sendEmailToUser(user_id, event_type, email_body)
      .then(() => {
        // console.log('Email успешно отправлен пользователю', user_id)
      })
      .catch(error => {
        console.error('Ошибка при отправке email:', error)
      })
  } catch (error) {
    console.error('Ошибка при отправке email:', error)
    throw new Error('Ошибка при отправке уведомления пользователю')
  }
}

module.exports = {
  noticeForLabSystemUsersT,
  noticeForLabSystemUsersTNewCommentT,
}

// const noticeForLabSystemUsersTNewCommentT = async (user_id, text, comment) => {
//   const io = socketManager.getIO()
//   // Отправка уведомления через сокеты
//   io.to('user_' + user_id).emit('reqForLabNewComment', { message: text, taskData: user_id })
//   try {
//     // Отправка email пользователю
//     //! can remove await
//     // await sendEmailToUser(user_id, text)
//     // Отправка email пользователю без ожидания
//     sendEmailToUser(user_id, text)
//       .then(() => {
//         // console.log('Email успешно отправлен пользователю', user_id)
//       })
//       .catch(error => {
//         console.error('Ошибка при отправке email:', error)
//         // Дополнительные действия по обработке ошибки, если необходимо
//       })
//   } catch (error) {
//     console.error('Ошибка при отправке email:', error)
//     throw new Error('Ошибка при отправке уведомления пользователю')
//   }
