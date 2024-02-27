'use strict'
let io = null

module.exports.socketManager  = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!')
    }
    return io;
  }
};