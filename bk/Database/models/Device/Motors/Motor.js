'use strict'

const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

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
      motor_id TEXT NOT NULL UNIQUE,
      device_id INTEGER NOT NULL,
      engine_number TEXT,  -- Номер двигателя
      brand_id INTEGER,
      model_id INTEGER,
      created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (device_id) REFERENCES devices (device_id),
      FOREIGN KEY (brand_id) REFERENCES motor_brands (id),
      FOREIGN KEY (model_id) REFERENCES motor_models (id)
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

const createMotorsBrandsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS motor_brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_name TEXT NOT NULL UNIQUE
    )`

  await executeTableCreation('motor_brands', createTableQuery, allowDrop)
}

const createMotorsModelsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS motor_models (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model_name TEXT NOT NULL,
      brand_id INTEGER NOT NULL,
      FOREIGN KEY (brand_id) REFERENCES motor_brands (id)
    )`

  await executeTableCreation('motor_models', createTableQuery, allowDrop)
}

const createMotorsConfigTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS motors_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      motor_config_id TEXT NOT NULL UNIQUE,
      motor_id INTEGER NOT NULL,
      power INTEGER NOT NULL,
      voltage INTEGER NOT NULL,
      amperage INTEGER NOT NULL,
      efficiency INTEGER NOT NULL,
      cosF INTEGER NOT NULL,
      rotationSpeed INTEGER NOT NULL,
      torque INTEGER NOT NULL,
      temperature INTEGER NOT NULL,
      operationMode INTEGER NOT NULL,
      protectionLevel INTEGER NOT NULL,
      explosionProof INTEGER NOT NULL,
      brake INTEGER NOT NULL,
      bearingType INTEGER NOT NULL,
      mounting INTEGER NOT NULL,
      created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (motor_id) REFERENCES motors (id),
      FOREIGN KEY (bearingType) REFERENCES bearingTypeT (id),
      FOREIGN KEY (brake) REFERENCES MotorBrakeT (id),
      FOREIGN KEY (cosF) REFERENCES MotorCosFT (id),
      FOREIGN KEY (efficiency) REFERENCES MotorEfficiencyT (id),
      FOREIGN KEY (explosionProof) REFERENCES MotorExplosionProofT (id),
      FOREIGN KEY (mounting) REFERENCES MotorMountingT (id),
      FOREIGN KEY (operationMode) REFERENCES MotorOperationModeT (id),
      FOREIGN KEY (power) REFERENCES motorPowerRangeT (id),
      FOREIGN KEY (protectionLevel) REFERENCES MotorProtectionLevelT (id),
      FOREIGN KEY (rotationSpeed) REFERENCES MotorRotationSpeedT (id),
      FOREIGN KEY (temperature) REFERENCES MotorTemperatureT (id),
      FOREIGN KEY (torque) REFERENCES MotorTorqueT (id),
      FOREIGN KEY (voltage) REFERENCES motorVoltageT (id)
    )`
  await executeTableCreation('motors_config', createTableQuery, allowDrop)
}

const createAllMotorTables = async (allowDrop = false) => {
  try {
    await createMotorsBrandsTable(allowDrop)
    await createMotorsModelsTable(allowDrop)
    await createMotorsTable(allowDrop)
    await createMotorsConfigTable(allowDrop)
    await createMotorsPLCSignalsTable(allowDrop)
    await createMotorsProtectionEquipmentTable(allowDrop)
    await createMotorsDocumentsTable(allowDrop)
  } catch (error) {
    console.log('Error creating motor tables: ', error)
    throw new Error('Failed to create all motor tables')
  }
}

module.exports = { createAllMotorTables }
