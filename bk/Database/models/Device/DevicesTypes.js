const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createDevicesTypesTable = async () => {
    try {
      // await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS devicesTypes`, [])
  
      await executeDatabaseQueryAsync(
        `CREATE TABLE IF NOT EXISTS devicesTypes  (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
         )`,
        []
      )
  
      const rows = await executeDatabaseQueryAsync('SELECT COUNT(*) as count FROM devicesTypes')
      if (rows[0].count === 0) { 
        await executeDatabaseQueryAsync(
          `INSERT INTO devicesTypes (name) VALUES 
          ('нория'), 
          ('вентилятор'), 
          ('транспортер'), 
          ('конвейер'), 
          ('сепаратор'), 
          ('бзо'), 
          ('мпо')`
        );
      }
    } catch (error) {
      console.log('DB ERROR: ', error)
    }
  }

  module.exports = {
    createDevicesTypesTable,
  }