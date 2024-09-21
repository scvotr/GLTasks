const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTableVenchelFiles = async () => {
  try {
    await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS venchel_files`, [])
    
    // await executeDatabaseQueryAsync(

    //   `CREATE TABLE IF NOT EXISTS venchel_files (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     venchel_id INTEGER,
    //     file_name TEXT,
    //     file_path TEXT,
    //     uploaded_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     FOREIGN KEY(venchel_id) REFERENCES venchels(venchel_id)
    //    )`, [])
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createTableVenchelFiles
}