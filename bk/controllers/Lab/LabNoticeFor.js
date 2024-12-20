'use strict'
const { socketManager } = require('../../utils/socket/socketManager')
const { sendEmailToUser } = require('../Tasks/mailFor')

const noticeForLabSystemUsersT = async (user_id, text) => {
  const io = socketManager.getIO()

  // Отправка уведомления через сокеты
  io.to('user_' + user_id).emit('reqForLab', { message: text, taskData: user_id })

  try {
    // Отправка email пользователю
    //! can remove await
    //! await sendEmailToUser(user_id, text)
    // Отправка email пользователю без ожидания 
    sendEmailToUser(user_id, text)
      .then(() => {
        // console.log('Email успешно отправлен пользователю', user_id)
      })
      .catch(error => {
        // console.error('Ошибка при отправке email:', error)
        // Дополнительные действия по обработке ошибки, если необходимо
      })
  } catch (error) {
    console.error('Ошибка при отправке email:', error)
    throw new Error('Ошибка при отправке уведомления пользователю')
  }
}

module.exports = {
  noticeForLabSystemUsersT,
}
