const { executeDatabaseQueryAsync, queryAsyncWraper } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const bcrypt = require('bcrypt');
require('dotenv').config()

const HASH_SALT = parseInt(process.env.KEY_SALT)
const SECRET_KEY = process.env.KEY_TOKEN

const createTableUsers = async () => {
  try {
    await executeDatabaseQueryAsync(
      // command
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        pin_code INTEGER, --временно 
        role TEXT NOT NULL,
        department_id INTEGER,
        subdepartment_id INTEGER,
        position_id INTEGER,
        FOREIGN KEY (department_id) REFERENCES departments(id),
        FOREIGN KEY (subdepartment_id) REFERENCES subdepartments(id),
        FOREIGN KEY (position_id) REFERENCES positions(id)
      )`, []
    )
    //! Выполняем проверку наличия записей в таблице
    const rows = await queryAsyncWraper('SELECT COUNT(*) FROM users', 'get');
    if (rows['COUNT(*)'] === 0) { // Если записей нет, то выполняем вставку начальных значений
      const hashedPassword = await bcrypt.hash('0091', HASH_SALT);
      const objUser = {
        id: 1,
        name: 'admin',
        email: 'admin',
        password: hashedPassword,
        role: 'admin'
      }; //console.log('>>>>>>>>>>>>', objUser)
      const {
        name,
        email,
        password,
        role
      } = objUser
      const command = `INSERT INTO users(name, email, password, role, department_id, subdepartment_id, position_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      await queryAsyncWraperParam(command, [name, email, password, role || 'user', 1, 1, 1], 'run', )
    }
  } catch (error) {
    console.error('createTableUsers ERROR: ', error);
  }
}

module.exports = {
  createTableUsers
}