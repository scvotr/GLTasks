const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery");

const createTableSchedulesComments = async () => {
  try {
    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS schedules_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        schedule_id INTEGER,
        user_id INTEGER,
        comment VARCHAR(255),
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(schedule_id) REFERENCES schedules(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      )`, []
    );
  } catch (error) {
    console.log('DB ERROR - createTableSchedulesComments: ', error);
  }
};

module.exports = {
  createTableSchedulesComments,
};