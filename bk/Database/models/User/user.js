const { executeDatabaseQueryAsync, queryAsyncWraper, queryAsyncWraperParam } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")
const bcrypt = require('bcrypt');
require('dotenv').config()

const HASH_SALT = parseInt(process.env.KEY_SALT)

const createTableUsers = async () => {
  try {
    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        pin_code INTEGER NOT NULL, --временно 
        role TEXT NOT NULL,
        role_ref INTEGER NOT NULL, --DEFAULT 0;
        department_id INTEGER,
        subdepartment_id INTEGER,
        position_id INTEGER,
        last_name TEXT,
        first_name TEXT,
        middle_name TEXT,
        internal_phone TEXT,
        external_phone TEXT,
        office_number TEXT,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id),
        FOREIGN KEY (subdepartment_id) REFERENCES subdepartments(id),
        FOREIGN KEY (position_id) REFERENCES positions(id),
        FOREIGN KEY (role_ref) REFERENCES userRoles(role)
      )`, []
    )
    const rows = await queryAsyncWraper('SELECT COUNT(*) FROM users', 'get')
    if (rows['COUNT(*)'] === 0) { 
      const hashedPassword = await bcrypt.hash('0091', HASH_SALT);
      const hashedPincode = await bcrypt.hash('0099', HASH_SALT);
      const objUser = { id: 999, name: 'admin', email: 'admin', password: hashedPassword, role: 'admin', pin_code: hashedPincode}
      const { id, name, email, password, role, pin_code } = objUser
      const command = `INSERT INTO users(id, name, email, password, role, role_ref, pin_code, department_id, subdepartment_id, position_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      await queryAsyncWraperParam(command, [id, name, email, password, role || 'user', 1, pin_code, 1, 1, 1], 'run', )
    }
  } catch (error) {
    console.error('createTableUsers ERROR: ', error)
  }
}

module.exports = {
  createTableUsers
}