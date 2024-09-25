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

const createMotorsBrandsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS motor_brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )`

  await executeTableCreation('motor_brands', createTableQuery, allowDrop)
}

const insertMotorBrands = async () => {
  const insertQuery = `
    INSERT INTO motor_brands (name) VALUES
      ('АИС'),
      ('АИР'),
      ('УралЭлектро'),
      ('5АИ'),
      ('Eldin'),
      ('БЭМЗ'),
      ('Eneral'),
      ('Электромаш'),
      ('Элком')
  `
  await executeInsertIfEmpty('motor_brands', insertQuery)
}

const createMotorsModelsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS motor_models (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand_id INTEGER NOT NULL,
      FOREIGN KEY (brand_id) REFERENCES motor_brands (id)
    )`

  await executeTableCreation('motor_models', createTableQuery, allowDrop)
}

const insertMotorModels = async () => {
  const insertQuery = `
    INSERT INTO motor_models (name, brand_id) VALUES
      ('АИС112L2', 1),
      ('АИС132SB2', 1),
      ('АИС132МВ2', 1),
      ('АИР 56 А2', 2),
      ('АИР 56 А4', 2),
      ('АИР 56 B2', 2),
      ('АИР 56 B4', 2),
      ('АИР 63 A2', 2),
      ('АИР 63 A4', 2),
      ('АИР 63 A6', 2),
      ('IMМ 112LM2 5,50 кВт 3000 об/мин', 3),
      ('IMМ 112LS4 5,50 кВт 1500 об/мин', 3),
      ('АДМ 100L8 1,50 кВт 750 об/мин', 3),
      ('АДМ 132S6 5,50 кВт 1000 об/мин', 3),
      ('5АИ 56 А4', 4),
      ('5АИ 56 Б2', 4),
      ('5АИ 56 Б4', 4),
      ('5АИ 63 А2', 4)
  `
  await executeInsertIfEmpty('motor_models', insertQuery)
}

const createMotorsConfigTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS motors_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      motor_config_id TEXT NOT NULL,
      motor_tech_num TEXT NOT NULL, -- Технологический номер (может быть дублирующимся)
      power_id INTEGER NOT NULL,
      voltage_id INTEGER NOT NULL,
      amperage_id INTEGER NOT NULL,
      efficiency_id INTEGER NOT NULL,
      cosF_id INTEGER NOT NULL,
      rotationSpeed_id INTEGER NOT NULL,
      torque_id INTEGER NOT NULL,
      temperature_id INTEGER NOT NULL,
      operationMode_id INTEGER NOT NULL,
      protectionLevel_id INTEGER NOT NULL,
      explosionProof_id INTEGER NOT NULL,
      brake_id INTEGER NOT NULL,
      bearingType_id INTEGER NOT NULL,
      mounting_id INTEGER NOT NULL,
      brand_id INTEGER NOT NULL,
      model_id INTEGER NOT NULL,
      created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bearingType_id) REFERENCES bearingTypeT (id),
      FOREIGN KEY (brake_id) REFERENCES MotorBrakeT (id),
      FOREIGN KEY (cosF_id) REFERENCES MotorCosFT (id),
      FOREIGN KEY (efficiency_id) REFERENCES MotorEfficiencyT (id),
      FOREIGN KEY (explosionProof_id) REFERENCES MotorExplosionProofT (id),
      FOREIGN KEY (mounting_id) REFERENCES MotorMountingT (id),
      FOREIGN KEY (operationMode_id) REFERENCES MotorOperationModeT (id),
      FOREIGN KEY (power_id) REFERENCES motorPowerRangeT (id),
      FOREIGN KEY (protectionLevel_id) REFERENCES MotorProtectionLevelT (id),
      FOREIGN KEY (rotationSpeed_id) REFERENCES MotorRotationSpeedT (id),
      FOREIGN KEY (temperature_id) REFERENCES MotorTemperatureT (id),
      FOREIGN KEY (torque_id) REFERENCES MotorTorqueT (id),
      FOREIGN KEY (voltage_id) REFERENCES motorVoltageT (id),
      FOREIGN KEY (amperage_id) REFERENCES MotorAmperageT (id),
      FOREIGN KEY (brand_id) REFERENCES motor_brands (id),
      FOREIGN KEY (model_id) REFERENCES motor_models (id)
    )`
  await executeTableCreation('motors_config', createTableQuery, allowDrop)
}

const createAllMotorTables = async (allowDrop = false) => {
  try {
    await createMotorsBrandsTable(allowDrop)
    await insertMotorBrands()
    await createMotorsModelsTable(allowDrop)
    await insertMotorModels()
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
