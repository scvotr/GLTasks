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


// const { executeDatabaseQueryAsync, queryAsyncWraper } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery");

// const createTables = async () => {
//   try {
//     // Создаем таблицу workshops
//     await executeDatabaseQueryAsync(
//       `CREATE TABLE IF NOT EXISTS workshops (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         department_id INTEGER NOT NULL,
//         name TEXT NOT NULL,
//         FOREIGN KEY (department_id) REFERENCES departments(id)
//       )`, []);

//     // Создаем таблицу sectors
//     await executeDatabaseQueryAsync(
//       `CREATE TABLE IF NOT EXISTS sectors (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         workshop_id INTEGER NOT NULL,
//         name TEXT NOT NULL,
//         FOREIGN KEY (workshop_id) REFERENCES workshops(id)
//       )`, []);

//     // Проверяем наличие записей в таблице workshops
//     const rowsWorkshops = await queryAsyncWraper('SELECT COUNT(*) FROM workshops', 'get');
//     if (rowsWorkshops['COUNT(*)'] === 0) { // Если записей нет, вставляем начальные значения
//       await queryAsyncWraper("INSERT INTO workshops (department_id, name) VALUES (3, 'Элеватор №1'), (3, 'Элеватор №2'), (4, 'Элеватор №1'), (4, 'Элеватор №2'), (4, 'Склад №5'), (4, 'Склады')", 'run');
//     }

//     // Проверяем наличие записей в таблице sectors
//     const rowsSectors = await queryAsyncWraper('SELECT COUNT(*) FROM sectors', 'get');
//     if (rowsSectors['COUNT(*)'] === 0) { // Если записей нет, вставляем начальные значения
//       await queryAsyncWraper("INSERT INTO sectors (workshop_id, name) VALUES (1, 'Ларь'), (1, 'Рабочая башня'), (2, 'Нижн.гал. с\\к№11'), (2, 'Нижн.гал. с\\к№12')", 'run');
//     }
//   } catch (error) {
//     console.error('createTables ERROR: ', error);
//   }
// };

// module.exports = {
//   createTables
// };