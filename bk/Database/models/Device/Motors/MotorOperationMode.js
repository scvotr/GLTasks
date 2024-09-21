'use strict'

const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createMotorMotorOperationModeTable = async () => {
  try {
    //! Удаляем таблицу, если она существует
    // await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS MotorOperationModeT`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS MotorOperationModeT  (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name REAL NOT NULL
         )`,
      []
    )

    const rows = await executeDatabaseQueryAsync('SELECT COUNT(*) as count FROM MotorOperationModeT')
    if (rows[0].count === 0) {
      await executeDatabaseQueryAsync(
        `INSERT INTO MotorOperationModeT (name) VALUES 
          (1), 
          (2), 
          (3)
          `
      )
    }
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createMotorMotorOperationModeTable,
}
