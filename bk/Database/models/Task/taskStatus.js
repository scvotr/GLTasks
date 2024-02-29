const { executeDatabaseQueryAsync, queryAsyncWraper } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTaskStatus = async () => {
  try {
    await executeDatabaseQueryAsync(
      // command
      `CREATE TABLE IF NOT EXISTS task_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT NOT NULL
       )`, [])
       const rows = await queryAsyncWraper('SELECT COUNT(*) FROM task_status', 'get');
       if (rows['COUNT(*)'] === 0) { // Если записей нет, то выполняем вставку начальных значений
         await queryAsyncWraper("INSERT INTO task_status (status) VALUES ('new'), ('draft'), ('toApprove'), ('approved'), ('inWork'), ('underReview'), ('closed')", 'run');
       }
  } catch (error) {
    console.log('DB ERROR - createTableTasks: ', error)
  }
}

module.exports ={
  createTaskStatus
}

// status отображает состояние задачи (создание, согласование, назначение ответственного, процесс исполнения, отправка на проверку, закрытие).
// assigned_to может содержать идентификатор ответственного лица.
// approval_status и rejection_reason могут использоваться для отслеживания согласования и причин отклонения.
// process_status может отображать процесс выполнения задачи.

// CREATE TABLE IF NOT EXISTS tasks (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   name TEXT NOT NULL,
//   status TEXT NOT NULL,
//   assigned_to INTEGER,
//   approval_status TEXT,
//   rejection_reason TEXT,
//   process_status TEXT,
//   note TEXT
// );