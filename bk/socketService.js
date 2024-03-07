'use strict'

const jwt = require('jsonwebtoken')
require('dotenv').config();
const logger = require('./utils/logger/logger');

let userSocketPool = [];

function addUserInCache(userId) {
  console.log('addUserInSocketCache: ', userId)
  if (!userSocketPool.includes(userId)) {
    //! if(!userSocketPool.some(id => id === userId)) {
    userSocketPool.push(userId)
    console.log('Активных пользователй: ', userSocketPool)
  }
}

function removeUserFromCache(userId) {
  console.log('removeUserFromSocketCache', userId)
  userSocketPool = userSocketPool.filter(id => id !== userId);
  console.log('Активных пользователй: ', userSocketPool)
}

function authenticateUserSocket(socket, next) {
  let token = socket.handshake.query.token;
  let tokenInHeaders = socket.handshake.headers.authorization;
  if (tokenInHeaders) {
    tokenInHeaders = tokenInHeaders.slice(7, tokenInHeaders.length);
    jwt.verify(tokenInHeaders, process.env.KEY_TOKEN, (err, decoded) => {
      if (err) {
        logger.errorAuth({
          message: 'Authentication failed: invalid token',
          token: tokenInHeaders
        });
        return next(new Error('Authentication error'));
      }
      socket.decoded = decoded;
      logger.infoAuth({
        message: 'Authentication successful',
        decode: socket.decoded.name
      });
      return next();
    });
  } else {
    logger.warn({
      message: 'Authentication failed: token is missing'
    });
    return next(new Error('Authentication error'));
  }
}

function setupSocket(io) {
  io.use(authenticateUserSocket)
    .on('connection', (socket) => {
      addUserInCache(socket.decoded.id)

      console.log('>>>>>>>>>>', socket.decoded)

      socket.join('allActiveUser')
      socket.join('user_' + socket.decoded.id) //?для каждого пользователя
      socket.join('dep_' + socket.decoded.department_id) //? для каждого подразделения
      socket.join('subDep_' + socket.decoded.subdepartment_id) //? для каждого отдела

      if (socket.decoded.role === 'chife') {
        let leadRoomName = 'leadSubDep_' + socket.decoded.subdepartment_id
        socket.join(leadRoomName)

        socket.on('newMessage', (message) => {
          // Это пример, внутренняя логика зависит от вашего предназначения
          io.to(leadRoomName).emit('messageReceived', message);
        });
      }

      socket.on('getMyRooms', () => {
        const allRooms = Array.from(socket.rooms)
        socket.emit('yourRooms',
          allRooms.filter((room) => room !== socket.id)
        )
      })

      socket.on('disconnect', () => {
        removeUserFromCache(socket.decoded.id)
      })

      socket.on('error', (error) => {
        console.error('Произошла ошибка сокета для пользователя с ID:', socket.decoded.id, error)
        logger.error('Произошла ошибка сокета для пользователя с ID:', socket.decoded.id, error)
      });
    })
}

module.exports = {
  setupSocket,
}


