const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery');

const createTableSchedules = async () => {
  try {
    await executeDatabaseQueryAsync(
      // command
      `CREATE TABLE IF NOT EXISTS schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        schedule_id TEXT NOT NULL,
        assign_user_id INTEGER NOT NULL,
        schedule_status TEXT NOT NULL,
        schedule_type TEXT,
        schedule_title TEXT,
        schedule_description TEXT,
        report TEXT,
        schedule_comment TEXT,
        deadline_time DATETIME,
        estimated_time INTEGER,
        schedule_priority BOOLEAN,
        appoint_user_id INTEGER NOT NULL,
        appoint_department_id INTEGER NOT NULL,
        appoint_subdepartment_id INTEGER NOT NULL,
        appoint_position_id INTEGER,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(assign_user_id) REFERENCES users(id),
        FOREIGN KEY(appoint_user_id) REFERENCES users(id),
        FOREIGN KEY(appoint_department_id) REFERENCES departments(id),
        FOREIGN KEY(appoint_subdepartment_id) REFERENCES subdepartments(id),
        FOREIGN KEY(appoint_position_id) REFERENCES positions(id)
      )`,
      []
    );
  } catch (error) {
    console.log('DB ERROR - createTableSchedules: ', error);
  }
};

const addCreatedOnField = async () => {
  try {
    // 1. Добавляем новый столбец без значения по умолчанию
    await executeDatabaseQueryAsync(
      `ALTER TABLE schedules ADD COLUMN created_on TIMESTAMP`
    );

    // 2. Обновляем существующие записи, присваивая им текущее время
    await executeDatabaseQueryAsync(
      `UPDATE schedules SET created_on = CURRENT_TIMESTAMP WHERE created_on IS NULL`
    );

    // 3. Изменяем столбец, чтобы он имел значение по умолчанию
    await executeDatabaseQueryAsync(
      `ALTER TABLE schedules ALTER COLUMN created_on SET DEFAULT CURRENT_TIMESTAMP`
    );
  } catch (error) {
    console.log('DB ERROR - addCreatedOnField: ', error);
  }
};

const addReportColumnToSchedules = async () => {
  try {
    // Добавляем столбец report, если его еще нет
    const checkColumnQuery = "PRAGMA table_info('schedules')";
    const columns = await executeDatabaseQueryAsync(checkColumnQuery);

    // Проверяем, существует ли столбец report
    const columnExists = columns.some(column => column.name === 'report');

    if (!columnExists) {
      await executeDatabaseQueryAsync(
        `ALTER TABLE schedules ADD COLUMN report TEXT`
      );
      console.log("Столбец 'report' успешно добавлен.");
    } else {
      console.log("Столбец 'report' уже существует.");
    }
  } catch (error) {
    console.log('DB ERROR - addReportColumnToSchedules: ', error);
  }
};

module.exports = {
  createTableSchedules,
  addCreatedOnField,
  addReportColumnToSchedules,
};