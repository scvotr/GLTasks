const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTablePendingNotifications = async () => {
  try {
    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS pending_notifications (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         user_id INTEGER NOT NULL,
         task_id INTEGER NOT NULL,
         delivered_status TEXT NOT NULL,
         message TEXT NOT NULL,
         created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         FOREIGN KEY(user_id) REFERENCES users(id)
       )`, [])
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createTablePendingNotifications
}