'use strict'
const fs = require("fs");

const readFileAsync = (file_path, encoding) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file_path, encoding, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

module.exports = {
  readFileAsync,
}