const { executeDatabaseQueryAsync, queryAsyncWraper, queryAsyncWraperParam } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const HASH_SALT = parseInt(process.env.KEY_SALT)
const SECRET_KEY = process.env.KEY_TOKEN

const createTableTokens = async () => {
  try {
    await executeDatabaseQueryAsync(
      // command
      `CREATE TABLE IF NOT EXISTS tokens  (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`, []
    )
    const rows = await queryAsyncWraper('SELECT COUNT(*) FROM tokens', 'get')
    if (rows['COUNT(*)'] === 0) { 
      const hashedPassword = await bcrypt.hash('0091', HASH_SALT)
      const objUser = { id: 1, name: 'admin', email: 'admin', password: hashedPassword, role: 'admin' }
      console.log('>>>>>>>>>>>>', objUser)
      const token = jwt.sign(objUser, SECRET_KEY)
      console.log('>>>>>>>>>>>>', token)
      const command = `INSERT INTO tokens(user_id, token) VALUES (?, ?)`
      await queryAsyncWraperParam(command, [objUser.id, token], `run`)
    }
  } catch (error) {
    console.error("Error creating tokens table:", error);
  }
};

module.exports = {
  createTableTokens
}