'use strict'

const { executeInsertIfEmpty } = require('../../../utils/executeInsertIfEmpty/executeInsertIfEmpty')
const { executeTableCreation } = require('../../../utils/executeTableCreation/executeTableCreation')

// const createMotors____Table = async (allowDrop = false) => {
//   const createTableQuery = `
//     )`

//   await executeTableCreation('____', createTableQuery, allowDrop)
// }

const createMotorsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS motors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      motor_id INTEGER NOT NULL,
      device_id INTEGER,
      motor_config_id TEXT,
      engine_number TEXT,
      created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      devices_installation_date DATETIME,
      qr_code BLOB,
      type_id INTEGER,
      workshop_id INTEGER,
      department_id INTEGER,
      on_repair BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (type_id) REFERENCES devicesTypes (id),
      FOREIGN KEY (device_id) REFERENCES devices (device_id),
      FOREIGN KEY (motor_config_id) REFERENCES motors_config(motor_config_id),
      FOREIGN KEY (workshop_id) REFERENCES workshops (id),
      FOREIGN KEY (department_id) REFERENCES departments (id)
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
