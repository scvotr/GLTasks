const { executeDatabaseQueryAsync, queryAsyncWraper } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTableSubdepartments = async () => {
  try {
    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS subdepartments    (
        id INTEGER PRIMARY KEY,
        department_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      )`, [])
    const rows = await queryAsyncWraper('SELECT COUNT(*) FROM subdepartments ', 'get');
    if (rows['COUNT(*)'] === 0) { 
      await queryAsyncWraper("INSERT INTO subdepartments (department_id, name) VALUES (1, 'новый'), (2, 'ХПР'), (3, 'АЕ Гл. Инженера'), (4, 'ПЕ Гл. Инженера'), (3, ' АЕ Служба Качества'), (4, 'ПЕ Служба Качества')", 'run');
    }
  } catch (error) {
    console.error('DB ERROR - createTableSubdepartments: ', error);
  }
}

module.exports = {
  createTableSubdepartments
}