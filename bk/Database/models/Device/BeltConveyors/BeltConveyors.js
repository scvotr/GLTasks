const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')
const { executeInsertIfEmpty } = require('../../../utils/executeInsertIfEmpty/executeInsertIfEmpty')

const executeTableCreation = async (tableName, createTableQuery, allowDrop = false) => {
  try {
    if (allowDrop) {
      await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS ${tableName}`, [])
    }
    await executeDatabaseQueryAsync(createTableQuery, [])
  } catch (error) {
    console.log(`DB ERROR (${tableName}): `, error)
    throw new Error(`Failed to create ${tableName} table`)
  }
}

const createBeltConveyorTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS beltConveyors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id INTEGER NOT NULL,
        belt_brand_id INTEGER, -- Марка ленты
        belt_installation_date DATETIME, -- Дата установки ленты
        belt_length INTEGER, -- Длина ленты
        chute_roller_quantity INTEGER, -- Количество желобчатых роликоопор
        straight_roller_quantity INTEGER, -- Количество прямых роликоопор
        roller_installation_date DATETIME, -- Дата установки роликоопор
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (device_id) REFERENCES devices(id),
        FOREIGN KEY (belt_brand_id) REFERENCES rollerBelts(id)
    )`
  await executeTableCreation('beltConveyors', createTableQuery, allowDrop)
}

const createRollerBeltBrandTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS rollerBelts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_name  TEXT NOT NULL
    )`
  await executeTableCreation('rollerBelts', createTableQuery, allowDrop)
}

const insertRollerBeltBrands = async () => {
  const insertQuery = `INSERT INTO rollerBelts (brand_name) VALUES 
    ('3-500-3-БКНЛ-65-2'),
    ('3-650-3-БКНЛ-65-2'),
    ('3-800-3-БКНЛ-65-2')
    `
  await executeInsertIfEmpty('rollerBelts', insertQuery)
}


const createAllBeltConveyorTables = async (allowDrop = false) => {
  try {

    await createRollerBeltBrandTable(allowDrop)
    await insertRollerBeltBrands()
    await createBeltConveyorTable(allowDrop)
  } catch (error) {
    console.log('Error creating motor tables: ', error)
    throw new Error('Failed to create all motor tables')
  }
}

module.exports = { createAllBeltConveyorTables }
