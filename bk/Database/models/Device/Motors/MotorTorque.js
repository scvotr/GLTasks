'use strict'

const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createMotorTorqueTable = async () => {
  try {
    //! Удаляем таблицу, если она существует
    //  await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS MotorTorqueT`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS MotorTorqueT  (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name REAL NOT NULL
         )`,
      []
    )

    const rows = await executeDatabaseQueryAsync('SELECT COUNT(*) as count FROM MotorTorqueT')
    if (rows[0].count === 0) {
      await executeDatabaseQueryAsync(
        `INSERT INTO MotorTorqueT (name) VALUES 
          (5.0), 
          (7.4), 
          (24.7), 
          (60.5)
          `
      )
    }
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createMotorTorqueTable,
}
