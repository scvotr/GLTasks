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
        ahead_completed_time DATETIME,
        estimated_time INTEGER,
        ahead_estimated_time INTEGER,
        schedule_priority BOOLEAN,
        schedule_priority_rate TEXT,
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
    // 1. Добавляем новый столбец с типом данных TIMESTAMP и значением по умолчанию CURRENT_TIMESTAMP
    // await executeDatabaseQueryAsync(
    //   `ALTER TABLE schedules ADD COLUMN created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
    // );

    // 2. Обновляем существующие записи, присваивая им текущее время
    // await executeDatabaseQueryAsync(
    //   `UPDATE schedules SET created_on = CURRENT_TIMESTAMP WHERE created_on IS NULL`
    // );

    // !
    // await executeDatabaseQueryAsync(
    //   `ALTER TABLE schedules ADD COLUMN ahead_completed_time DATETIME`
    // )
    // // !
    // await executeDatabaseQueryAsync(
    //   `ALTER TABLE schedules ADD COLUMN ahead_estimated_time INTEGER`
    // )
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

const addSchedulePriorityRateColumnToSchedules = async () => {
  try {
    // Получаем информацию о столбцах таблицы schedules
    const checkColumnQuery = "PRAGMA table_info('schedules')";
    const columns = await executeDatabaseQueryAsync(checkColumnQuery);

    // Проверяем, существует ли столбец schedule_priority_rate
    const columnExists = columns.some(column => column.name === 'schedule_priority_rate');

    if (!columnExists) {
      // Добавляем столбец schedule_priority_rate, если его еще нет
      await executeDatabaseQueryAsync(
        `ALTER TABLE schedules ADD COLUMN schedule_priority_rate TEXT`
      );
      console.log("Столбец 'schedule_priority_rate' успешно добавлен.");
    } else {
      console.log("Столбец 'schedule_priority_rate' уже существует.");
    }
  } catch (error) {
    console.log('DB ERROR - addSchedulePriorityRateColumnToSchedules: ', error);
  }
};

module.exports = {
  createTableSchedules,
  addCreatedOnField,
  addReportColumnToSchedules,
  addSchedulePriorityRateColumnToSchedules,
};