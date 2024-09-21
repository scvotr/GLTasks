'use strict'

const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createMotorMountingTable = async () => {
  try {
    //! Удаляем таблицу, если она существует
    // await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS MotorMountingT`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS MotorMountingT  (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name REAL NOT NULL
         )`,
      []
    )

    const rows = await executeDatabaseQueryAsync('SELECT COUNT(*) as count FROM MotorMountingT')
    if (rows[0].count === 0) {
      await executeDatabaseQueryAsync(
        `INSERT INTO MotorMountingT (name) VALUES 
          (1001), 
          (1031), 
          (1051), 
          (1061), 
          (1071), 
          (2001), 
          (2011), 
          (2031), 
          (2101), 
          (2111), 
          (2131), 
          (1011)
          `
      )
    }
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createMotorMountingTable,
}
