const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTableVenchelComments = async () => {
  try {
    await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS venchel_comments`, [])

    // await executeDatabaseQueryAsync(

    //   `CREATE TABLE IF NOT EXISTS venchel_comments (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     task_id INTEGER,
    //     user_id INTEGER,
    //     comment VARCHAR(255),
    //     created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     FOREIGN KEY(task_id) REFERENCES tasks(id),
    //     FOREIGN KEY(user_id) REFERENCES users(id)
    //    )`, [])
  } catch (error) {
    console.log('DB ERROR - createTableVenchelComments: ', error)
  }
}

module.exports = {
  createTableVenchelComments,
}