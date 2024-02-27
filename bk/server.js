'use strict'

const http = require('http')
require('dotenv').config();

const server = http.createServer(async (req, res) => {

  server.on("error", (error) => {
    console.log("server.on ", error)
  })

  server.listen({ host, port }, () => {
    const address = server.address();
    console.log(`Сервер запущен на адресе ${address.address}:${address.port}`);
  })
})