const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTableDeviceComments = async () => {
  try {
    // await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS devices_comments`, [])
    await executeDatabaseQueryAsync(

      `CREATE TABLE IF NOT EXISTS devices_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id INTEGER,
        user_id INTEGER,
        comment VARCHAR(255),
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(device_id) REFERENCES devices(device_id),
        FOREIGN KEY(user_id) REFERENCES users(id)
       )`, [])
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createTableDeviceComments,
}