'use strict'

const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createMotorCosFTable = async () => {
  try {
    //! Удаляем таблицу, если она существует
    //  await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS MotorCosFT`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS MotorCosFT  (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name REAL NOT NULL
         )`,
      []
    )

    const rows = await executeDatabaseQueryAsync('SELECT COUNT(*) as count FROM MotorCosFT')
    if (rows[0].count === 0) {
      await executeDatabaseQueryAsync(
        `INSERT INTO MotorCosFT (name) VALUES 
          (1), 
          (0.90), 
          (0.89), 
          (0.88), 
          (0.87), 
          (0.86), 
          (0.85), 
          (0.84), 
          (0.83), 
          (0.82), 
          (0.81), 
          (0.80)
          `
      )
    }
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createMotorCosFTable,
}