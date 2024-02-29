const { executeDatabaseQueryAsync, queryAsyncWraper } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTableWorkshops = async () => {
  try {
    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS workshops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        department_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      )`, []);

    // Выполняем проверку наличия записей в таблице
    const rows = await queryAsyncWraper('SELECT COUNT(*) FROM workshops', 'get');
    if (rows['COUNT(*)'] === 0) { // Если записей нет, то выполняем вставку начальных значений
      // 3-Алексиков 4-Панфилово
      await queryAsyncWraper("INSERT INTO workshops (department_id, name) VALUES (3, 'Элеватор №1'), (3, 'Элеватор №2'), (4, 'Элеватор №1'), (4, 'Элеватор №2'), (4, 'Склад №5'), (4, 'Склады')", 'run');
    }
  } catch (error) {
    console.error('createTableWorkshops ERROR: ', error);
  }
}

module.exports = {
  createTableWorkshops
}