const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTaskStatus = async () => {
  try {
    await executeDatabaseQueryAsync(
      // command
      `CREATE TABLE IF NOT EXISTS taskStatus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT NOT NULL
       )`, [])
  } catch (error) {
    console.log('DB ERROR - createTableTasks: ', error)
  }
}

module.exports ={
  createTaskStatus
}