'use strict'

const handleOptionsRequest = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization")
  res.writeHead(204)
  res.end()
}

module.exports = {handleOptionsRequest}