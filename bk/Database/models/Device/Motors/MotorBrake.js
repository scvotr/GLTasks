'use strict'

const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createMotorBrakeTable = async () => {
  try {
    //! Удаляем таблицу, если она существует
    // await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS MotorBrakeT`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS MotorBrakeT  (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name REAL NOT NULL
         )`,
      []
    )

    const rows = await executeDatabaseQueryAsync('SELECT COUNT(*) as count FROM MotorBrakeT')
    if (rows[0].count === 0) {
      await executeDatabaseQueryAsync(
        `INSERT INTO MotorBrakeT (name) VALUES 
          (0), 
          (1)
          `
      )
    }
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createMotorBrakeTable,
}
