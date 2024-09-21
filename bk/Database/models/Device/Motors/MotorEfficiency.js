'use strict'

const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createMotorEfficiencyTable = async () => {
  try {
    //! Удаляем таблицу, если она существует
    //  await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS MotorEfficiencyT`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS MotorEfficiencyT  (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name REAL NOT NULL
         )`,
      []
    )

    const rows = await executeDatabaseQueryAsync('SELECT COUNT(*) as count FROM MotorEfficiencyT')
    if (rows[0].count === 0) {
      await executeDatabaseQueryAsync(
        `INSERT INTO MotorEfficiencyT (name) VALUES 
          (99.0), 
          (98.0), 
          (97.0), 
          (96.0), 
          (95.0), 
          (94.0), 
          (93.0), 
          (92.0), 
          (91.0), 
          (90.0)
          `
      )
    }
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createMotorEfficiencyTable,
}