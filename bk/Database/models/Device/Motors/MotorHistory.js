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
        repair_reason TEXT,
        technician_id INTEGER,
        additional_notes_reason TEXT,
        additional_notes_report TEXT,
        FOREIGN KEY (motor_id) REFERENCES motors (motor_id)
        --FOREIGN KEY (motor_id) REFERENCES motors (id)
      )`

  await executeTableCreation('motor_repair_history', createTableQuery, allowDrop)
}
// Функция для сброса триггеров
const dropRepairTriggers = async () => {
  const dropStartTrigger = `DROP TRIGGER IF EXISTS start_repair_trigger;`
  const dropEndTrigger = `DROP TRIGGER IF EXISTS end_repair_trigger;`

  try {
    await executeTableCreation('start_repair_trigger', dropStartTrigger)
    await executeTableCreation('end_repair_trigger', dropEndTrigger)
    console.log('Триггеры успешно удалены!')
  } catch (error) {
    console.error('Ошибка при удалении триггеров: ', error)
    throw new Error('Не удалось удалить триггеры')
  }
}
// Функция для создания триггеров
const createRepairTriggers = async useTriggers => {
  if (!useTriggers) {
    console.log('Триггеры не будут созданы.')
    return // Выход из функции, если триггеры не нужны
  }
  const startRepairTrigger = `
    CREATE TRIGGER IF NOT EXISTS start_repair_trigger
    AFTER UPDATE OF on_repair ON motors
    FOR EACH ROW
    WHEN NEW.on_repair = TRUE AND OLD.on_repair = FALSE
    BEGIN
      INSERT INTO motor_repair_history (motor_id, repair_start)
      VALUES (NEW.motor_id, CURRENT_TIMESTAMP);
      --VALUES (NEW.id, CURRENT_TIMESTAMP);
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
      WHERE motor_id = NEW.motor_id AND repair_end IS NULL;
      --WHERE motor_id = NEW.id AND repair_end IS NULL;
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

const createAllMotorHistory = async (allowDrop = false, useTriggers = false) => {
  try {
    await createMotorsRepairHistoryTable(allowDrop)
    // await createRepairTriggers() // Создание триггеров после создания таблицы
    // Если useTriggers равно false, удаляем триггеры
    if (!useTriggers) {
      await dropRepairTriggers()
    } else {
      await createRepairTriggers(useTriggers) // Создание триггеров
    }
  } catch (error) {
    console.log('Error creating motor history tables: ', error)
    throw new Error('Failed to create all motor history tables')
  }
}

module.exports = { createAllMotorHistory }
