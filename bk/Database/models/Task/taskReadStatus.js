const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTableTaskReadStatus = async () => {
  try {
    await executeDatabaseQueryAsync(
      // command
      `CREATE TABLE IF NOT EXISTS task_read_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        read_status TEXT NOT NULL,
        read_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(task_id) REFERENCES tasks(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`, [])
    // Создаем индекс
    // await executeDatabaseQueryAsync(
    //   `CREATE INDEX idx_read_status ON task_read_status (read_status);`, "run");
  } catch (error) {
    console.log('DB ERROR - createTableTaskReadStatus: ', error)
  }
}

module.exports = {
  createTableTaskReadStatus
}

// SELECT tasks.task_name, task_read_status.read_status
// FROM tasks
// LEFT JOIN task_read_status ON tasks.id = task_read_status.task_id
// ORDER BY task_read_status.read_status DESC, tasks.task_name;

// SELECT tasks.task_name, task_read_status.read_status
// FROM tasks
// LEFT JOIN task_read_status ON tasks.id = task_read_status.task_id
// ORDER BY 
//     CASE WHEN task_read_status.read_status = 'read' THEN 0 ELSE 1 END, 
//     tasks.task_name;

// INSERT INTO task_read_status (task_id, user_id, read_status, read_date)
// VALUES (<id задачи>, <id пользователя>, 'read', CURRENT_TIMESTAMP)
// ON CONFLICT (task_id, user_id) DO UPDATE
// SET read_status = 'read', read_date = CURRENT_TIMESTAMP;

// BEGIN TRANSACTION;
// UPDATE tasks SET task_status = 'read' WHERE id = <id задачи>;
// INSERT INTO task_read_status (task_id, user_id, read_status, read_date)
// VALUES (<id задачи>, <id пользователя>, 'read', CURRENT_TIMESTAMP)
// ON CONFLICT (task_id, user_id) DO UPDATE
// SET read_status = 'read', read_date = CURRENT_TIMESTAMP;
// COMMIT;