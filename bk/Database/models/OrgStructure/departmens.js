const { executeDatabaseQueryAsync, queryAsyncWraper } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTableDepartments = async () => {
  try {
    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )`, []
    )
    const rows = await queryAsyncWraper('SELECT COUNT(*) FROM departments', 'get');
    if (rows['COUNT(*)'] === 0) {
      await queryAsyncWraper("INSERT INTO departments (name) VALUES ('новый'), ('Гелио-Пакс'), ('Алексиковский Э.'), ('Панфиловский Э.')", 'run');
    }
  } catch (error) {
    console.error('DB ERROR - createTableDepartments: ', error);
  }
};

module.exports = {
  createTableDepartments
}