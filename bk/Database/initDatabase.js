const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('../database.db')

const initDatabase = async() => {}

db.serialize(async () => {

})

module.exports ={
  initDatabase,
}

