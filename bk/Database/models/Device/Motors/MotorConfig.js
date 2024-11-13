'use strict'
const { executeInsertIfEmpty } = require('../../../utils/executeInsertIfEmpty/executeInsertIfEmpty')
const { executeTableCreation } = require('../../../utils/executeTableCreation/executeTableCreation')

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
        installed_on BOOLEAN DEFAULT FALSE,
        on_repair BOOLEAN DEFAULT FALSE,
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
const insertMotorConfigs = async () => {
  const insertQuery = `
    INSERT INTO motors_config (motor_config_id, motor_tech_num, power_id, voltage_id, amperage_id, efficiency_id, cosF_id, rotationSpeed_id, torque_id, temperature_id, operationMode_id, protectionLevel_id, explosionProof_id, brake_id, bearingType_id, mounting_id, brand_id, model_id, installed_on, on_repair, created_on) VALUES
      ('2ced27eb-061a-40ae-8ae6-8b98524716bb', '22121', 15, 2, 9, 5, 4, 2, 4, 2, 1, 3, 2, 1, 1, 7, 1, 1, 0, 0, '2024-10-19 03:47:33'),
      ('6ba747f5-945a-4997-807a-69c1b1d38022', '3211', 12, 2, 8, 4, 4, 3, 4, 2, 3, 1, 2, 1, 2, 7, 1, 3, 0, 0, '2024-10-19 03:48:10'),
      ('abd2abf5-edb6-41ac-be85-7df7f76f3094', '6544', 9, 2, 7, 4, 5, 3, 4, 1, 1, 1, 2, 2, 2, 6, 2, 6, 0, 0, '2024-10-19 03:48:49'),
      ('b2cd7574-c651-4e09-b7eb-15323975bdee', '8877', 8, 2, 5, 2, 4, 2, 3, 3, 3, 1, 3, 2, 1, 7, 3, 14, 0, 0, '2024-10-19 03:49:32'),
      ('f1e2d3c4-b5a6-7e8f-9a0b-c1d2e3f4g5h6', '12345', 10, 2, 6, 3, 4, 1, 5, 2, 1, 2, 1, 1, 1, 5, 1, 2, 0, 0, '2024-10-19 03:50:00'),
      ('g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2', '23456', 11, 2, 7, 4, 3, 2, 6, 3, 2, 1, 2, 2, 1, 6, 2, 3, 0, 0, '2024-10-19 03:51:00'),
      ('w3x4y5z6-a7b8-c9d0-e1f2-g3h4i5j6k7l8', '34567', 12, 2, 8, 5, 5, 3, 7, 1, 3, 1, 1, 1, 2, 7, 3, 4, 0, 0, '2024-10-19 03:52:00'),
      ('m9n0o1p2-q3r4-s5t6-u7v8-w9x0y1z2a3b4', '45678', 13, 2, 9, 2, 4, 1, 4, 2, 1, 2, 2, 2, 1, 8, 1, 5, 0, 0, '2024-10-19 03:53:00');
  `
  await executeInsertIfEmpty('motors_config', insertQuery)
}

const createAllMotorConfigTables = async (allowDrop = false) => {
  try {
    await createMotorsBrandsTable(allowDrop)
    await insertMotorBrands()
    await createMotorsModelsTable(allowDrop)
    await insertMotorModels()
    await createMotorsConfigTable(allowDrop)
    await insertMotorConfigs()
  } catch (error) {
    console.log('Error creating motor tables: ', error)
    throw new Error('Failed to create all motor tables')
  }
}

module.exports = { createAllMotorConfigTables }
