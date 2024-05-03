const { Pool } = require('pg');

// Параметры подключения к вашей базе данных PostgreSQL
const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432, // порт вашей базы данных PostgreSQL
});

const executePGDatabaseQuery = async (command, params = [], method = 'query') => {
  const client = await pool.connect(); // Получаем клиента из пула соединений

  try {
    const result = await client[method](command, params);
    return result.rows; // Возвращаем результат запроса
  } finally {
    client.release(); // Возвращаем клиента в пул после выполнения запроса
  }
};


module.exports = {
  executePGDatabaseQuery
}

// usege

// const result = await executeDatabaseQueryAsync('SELECT * FROM your_table');
// console.log(result); // Вывод результата запроса