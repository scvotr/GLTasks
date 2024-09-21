const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTableDeviceFiles = async () => {
  try {
    // await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS device_files`, [])
    await executeDatabaseQueryAsync(

      `CREATE TABLE IF NOT EXISTS device_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id INTEGER,
        file_name TEXT,
        file_path TEXT,
        uploaded_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(device_id) REFERENCES devices(device_id)
       )`, [])
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createTableDeviceFiles
}