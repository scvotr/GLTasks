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
        schedule_comment TEXT,
        deadline_time DATETIME,
        estimated_time INTEGER,
        schedule_priority BOOLEAN,
        appoint_user_id INTEGER NOT NULL,
        appoint_department_id INTEGER NOT NULL,
        appoint_subdepartment_id INTEGER NOT NULL,
        appoint_position_id INTEGER,
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

module.exports = {
  createTableSchedules,
};