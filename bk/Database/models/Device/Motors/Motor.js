'use strict'

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

// const createMotors____Table = async (allowDrop = false) => {
//   const createTableQuery = `
//     )`

//   await executeTableCreation('____', createTableQuery, allowDrop)
// }

const createMotorsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS motors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      motor_config_id TEXT NOT NULL,
      device_id INTEGER,
      engine_number TEXT,
      created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (device_id) REFERENCES devices (device_id)
      FOREIGN KEY (motor_config_id) REFERENCES motors_config(motor_config_id)
    )`

  await executeTableCreation('motors', createTableQuery, allowDrop)
}

const createMotorsPLCSignalsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS motors_plc_signals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      motor_id INTEGER NOT NULL,
      signal_name TEXT NOT NULL,
      signal_value TEXT NOT NULL,
      FOREIGN KEY (motor_id) REFERENCES motors (id)
    )`

  await executeTableCreation('motors_plc_signals', createTableQuery, allowDrop)
}

const createMotorsProtectionEquipmentTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS protection_equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      motor_id INTEGER NOT NULL,
      equipment_name TEXT NOT NULL,
      FOREIGN KEY (motor_id) REFERENCES motors (id)
    )`

  await executeTableCreation('protection_equipment', createTableQuery, allowDrop)
}

const createMotorsDocumentsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS motor_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      motor_id INTEGER NOT NULL,
      document_url TEXT,  -- Ссылка на документацию
      photo_url TEXT,  -- Ссылка на фотографию
      FOREIGN KEY (motor_id) REFERENCES motors (id)
    )`

  await executeTableCreation('motor_documents', createTableQuery, allowDrop)
}

const createAllMotorTables = async (allowDrop = false) => {
  try {
    await createMotorsPLCSignalsTable(allowDrop)
    await createMotorsProtectionEquipmentTable(allowDrop)
    await createMotorsDocumentsTable(allowDrop)
    await createMotorsTable(allowDrop)
  } catch (error) {
    console.log('Error creating motor tables: ', error)
    throw new Error('Failed to create all motor tables')
  }
}

module.exports = { createAllMotorTables }
