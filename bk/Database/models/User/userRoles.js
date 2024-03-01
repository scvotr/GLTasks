const { executeDatabaseQueryAsync, queryAsyncWraper } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createUserRoles = async () => {
  try {
    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS user_roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL
       )`, []
    )
    const rows = await queryAsyncWraper('SELECT COUNT(*) FROM user_roles', 'get');
    if (rows['COUNT(*)'] === 0) { // Если записей нет, то выполняем вставку начальных значений
      await queryAsyncWraper("INSERT INTO user_roles (role) VALUES ('admin'), ('new'), ('guest'), ('user'), ('lead'), ('general')", 'run');
    }
  } catch (error) {
    console.log('DB ERROR - createUserRoles: ', error)
  }
}

module.exports ={
  createUserRoles
}