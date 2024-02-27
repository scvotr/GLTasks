'use strict'

const http = require('http')
require('dotenv').config()

const server = http.createServer(async (req, res) => {})

server.on("error", (error) => {
  console.log("server.on ", error)
})

const host = process.env.HOST || "localhost"
const port = process.env.PORT || 3070

server.listen({ host,port }, () => {
  const address = server.address()
  console.log(`Сервер запущен на адресе ${address.address}:${address.port}`)
})

// $env:HOST="192.168.8.102"; $env:PORT="3050"; node .\server.js // win PowerShell 
// $env:HOST="localhost"; $env:PORT="3070"; node .\server.js     // win PowerShell 
// export HOST=192.168.8.102 export PORT=3050 node ./server.js   // Unix и Linux
// export HOST=localhost export PORT=3070 node ./server.js       // Unix и Linux