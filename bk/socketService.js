'use strict'

const jwt = require('jsonwebtoken')
require('dotenv').config();

let userSocketPool = [];


function setupSocket(io) {
  io.use(authenticateSocket)
    .on('connection', (socket) => {
      addUserInCache(socket.decoded.id)
    })
}