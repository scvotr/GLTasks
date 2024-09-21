'use strict'

const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createMotorRotationSpeedTable = async () => {
  try {
    //! Удаляем таблицу, если она существует
    //  await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS MotorRotationSpeedT`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS MotorRotationSpeedT  (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name REAL NOT NULL
         )`,
      []
    )

    const rows = await executeDatabaseQueryAsync('SELECT COUNT(*) as count FROM MotorRotationSpeedT')
    if (rows[0].count === 0) {
      await executeDatabaseQueryAsync(
        `INSERT INTO MotorRotationSpeedT (name) VALUES 
          (750), 
          (1000), 
          (1500), 
          (3000)
          `
      )
    }
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
    createMotorRotationSpeedTable,
}
