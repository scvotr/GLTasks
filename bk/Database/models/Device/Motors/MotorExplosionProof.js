'use strict'

const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createMotorExplosionProofTable = async () => {
  try {
    //! Удаляем таблицу, если она существует
    // await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS MotorExplosionProofT`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS MotorExplosionProofT  (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name REAL NOT NULL
         )`,
      []
    )

    const rows = await executeDatabaseQueryAsync('SELECT COUNT(*) as count FROM MotorExplosionProofT')
    if (rows[0].count === 0) {
      await executeDatabaseQueryAsync(
        `INSERT INTO MotorExplosionProofT (name) VALUES 
          (0), 
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
  createMotorExplosionProofTable,
}
