'use strict'

const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createMotorBearingTypeTable = async () => {
  try {
    //! Удаляем таблицу, если она существует
    // await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS bearingTypeT`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS bearingTypeT  (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name REAL NOT NULL
         )`,
      []
    )

    const rows = await executeDatabaseQueryAsync('SELECT COUNT(*) as count FROM bearingTypeT')
    if (rows[0].count === 0) {
      await executeDatabaseQueryAsync(
        `INSERT INTO bearingTypeT (name) VALUES 
          (1),
          (2)
          `
      )
    }
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createMotorBearingTypeTable,
}