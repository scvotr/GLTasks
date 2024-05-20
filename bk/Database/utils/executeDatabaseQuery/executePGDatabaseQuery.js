const { Pool } = require('pg')
const logger = require('../../../utils/logger/logger')
require('dotenv').config()

// Создаем новый пул соединений к вашей удаленной базе данных PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'gltest',
  password: process.env.POSTGRES_PASSWORD || '0000',
  port: process.env.POSTGRES_PORT || 5432,
})

const executePGDatabaseQuery = async (command, params = [], method = 'query') => {
  try {
    const client = await pool.connect() // Получаем клиента из пула соединений
    try {
      logger.info(`Connection successfully opened. Query is: ${command}`)
      const result = await client[method](command, params)
      return result.rows
    } finally {
      client.release()
    }
  } catch (error) {
    logger.error(`Error executing query: ${error}`);
    throw error
  }
}

module.exports = {
  executePGDatabaseQuery,
}

// usege

// const result = await executeDatabaseQueryAsync('SELECT * FROM your_table');
// console.log(result); // Вывод результата запроса

// query
// const result = await executePGDatabaseQuery('SELECT * FROM users');

// insert
// const result = await executePGDatabaseQuery('INSERT INTO users (name, email) VALUES ($1, $2)', ['John', 'john@example.com'], 'insert');

// update
// const result = await executePGDatabaseQuery('UPDATE users SET name = $1 WHERE id = $2', ['Jane', 123], 'update');

// delete
// const result = await executePGDatabaseQuery('DELETE FROM users WHERE id = $1', [123], 'delete');


