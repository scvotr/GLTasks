'use strict'

const { executeInsertIfEmpty } = require('../../../utils/executeInsertIfEmpty/executeInsertIfEmpty')
const { executeTableCreation } = require('../../../utils/executeTableCreation/executeTableCreation')

const createMotorsRepairHistoryTable = async (allowDrop = false) => {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS motor_repair_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        motor_id INTEGER NOT NULL,
        repair_start DATATIME,
        repair_end DATATIME,
        FOREIGN KEY (motor_id) REFERENCES motors (id)
      )`

  await executeTableCreation('motor_repair_history', createTableQuery, allowDrop)
}

// Функция для создания триггеров
const createRepairTriggers = async () => {
  const startRepairTrigger = `
    CREATE TRIGGER IF NOT EXISTS start_repair_trigger
    AFTER UPDATE OF on_repair ON motors
    FOR EACH ROW
    WHEN NEW.on_repair = TRUE AND OLD.on_repair = FALSE
    BEGIN
      INSERT INTO motor_repair_history (motor_id, repair_start)
      VALUES (NEW.id, CURRENT_TIMESTAMP);
    END;
  `

  const endRepairTrigger = `
    CREATE TRIGGER IF NOT EXISTS end_repair_trigger
    AFTER UPDATE OF on_repair ON motors
    FOR EACH ROW
    WHEN NEW.on_repair = FALSE AND OLD.on_repair = TRUE
    BEGIN
      UPDATE motor_repair_history
      SET repair_end = CURRENT_TIMESTAMP
      WHERE motor_id = NEW.id AND repair_end IS NULL;
    END;
  `

  // Здесь нужно выполнить создание триггеров
  try {
    await executeTableCreation('start_repair_trigger', startRepairTrigger)
    await executeTableCreation('end_repair_trigger', endRepairTrigger)
    console.log('triger ok!!')
  } catch (error) {
    console.error('Error creating triggers: ', error)
    throw new Error('Failed to create triggers')
  }
}

const createAllMotorHistory = async (allowDrop = false) => {
  try {
    await createMotorsRepairHistoryTable(allowDrop)
    await createRepairTriggers() // Создание триггеров после создания таблицы
  } catch (error) {
    console.log('Error creating motor history tables: ', error)
    throw new Error('Failed to create all motor history tables')
  }
}

module.exports = { createAllMotorHistory }
