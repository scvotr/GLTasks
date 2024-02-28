'use strict'

const fs = require('fs');

const logMessage = (data, actionTypeName) => {
  const now = new Date()
  const currentDate = `${now.getDate()} ${now.getFullYear()}`
  const currentTime = now.toLocaleTimeString()
  return `\n Пользователь ID: ${data.id} ${data.name} ${currentDate} ${currentTime} ${actionTypeName};\n`
}

const logConnectionUserData = (socket) => {
  socket.on('userConnect', (data) => {
    const userData = {
      id: data.userId,
      name: data.userName,
    };
    fs.appendFile('socket_logs.txt', logMessage(userData, 'что то отправил'), (err) => {
      if (err) {
        console.log('logConnectionUserData', err)
        throw err
      }
    });
  })
}

const logConnection = (socket) => {
  fs.appendFile('socket_logs.txt', logMessage(socket.decoded, 'подключился'), (err) => {
    if (err) {
      console.log('logConnection', err)
      throw err
    }
  })
  // Дополнительная логика при подключении пользователя
}

const logDisconnection = (socket) => {
  fs.appendFile('socket_logs.txt', logMessage(socket.decoded, 'отключился'), (err) => {
    if (err) {
      console.log('logDisconnection', err)
      throw err
    }
  });
  // Дополнительная логика при отключении пользователя
}

const socketEventLogger = (io) => {
  io.on('connection', (socket) => {
    logConnection(socket);
    logConnectionUserData(socket)
    socket.on('disconnect', () => {
      logDisconnection(socket);
    });
    // Другие обработчики событий и логика
  });
}

module.exports = socketEventLogger;
