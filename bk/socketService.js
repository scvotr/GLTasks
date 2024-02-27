'use strict'

const jwt = require('jsonwebtoken')
require('dotenv').config();

let userSocketPool = [];

function addUserInCache(userId) {
  console.log('addUserInSocketCache: ', userId)
  if(!userSocketPool.includes(userId)) {
  // if(!userSocketPool.some(id => id === userId)) {
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
    })
}