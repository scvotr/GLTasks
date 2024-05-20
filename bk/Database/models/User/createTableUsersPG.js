const { executePGDatabaseQuery } = require('../../utils/executeDatabaseQuery/executePGDatabaseQuery')
const bcrypt = require('bcrypt')
require('dotenv').config()
const HASH_SALT = parseInt(process.env.KEY_SALT)

const createTableUsersPG = async () => {
  try {
    await executePGDatabaseQuery(
      `CREATE TABLE IF NOT EXISTS gltasks.users (
        id SERIAL PRIMARY KEY,
        login TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        pin_code TEXT NOT NULL,
        role TEXT NOT NULL,
        role_ref INTEGER NOT NULL,
        department_id INTEGER,
        subdepartment_id INTEGER,
        position_id INTEGER,
        last_name TEXT,
        first_name TEXT,
        middle_name TEXT,
        internal_phone TEXT,
        external_phone TEXT,
        office_number TEXT,
        email_for_notify TEXT,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      []
    )

    const rows = await executePGDatabaseQuery('SELECT COUNT(*) FROM gltasks.users')

    if (parseInt(rows[0]['count']) === 0) {
      const hashedPassword = await bcrypt.hash('0091', HASH_SALT)
      const hashedPincode = await bcrypt.hash('0099', HASH_SALT)
      const objUser = { id: 999, login: 'admin', email: 'admin', password: hashedPassword, role: 'admin', pin_code: hashedPincode }
      const { id, login, email, password, role, pin_code } = objUser
      const command = `INSERT INTO gltasks.users(id, login, email, password, role, role_ref, pin_code, department_id, subdepartment_id, position_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
      await executePGDatabaseQuery(command, [id, login, email, password, role || 'user', 1, pin_code, 1, 1, 1])
    }
  } catch (error) {
    console.error('createTableUsersPG ERROR: ', error)
  }
}

module.exports = {
  createTableUsersPG,
}
