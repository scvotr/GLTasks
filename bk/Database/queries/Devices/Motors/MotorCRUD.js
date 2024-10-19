const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')
// Вынести в утилитную функцию
const QRCode = require('qrcode')

const generateQRCodeToURL = async machineId => {
  try {
    // Формируем URL с использованием machineId
    const baseURL = 'http://192.168.8.102:3001/admin/devices/' // Замените на ваш базовый URL
    const url = `${baseURL}${machineId}`

    // Генерируем QR-код для URL
    const qrCodeDataURL = await QRCode.toDataURL(url)
    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

class MotorCRUD {
  async createMotorQ(data) {
    const { device_id, tech_num, type_id, workshop_id, department_id } = data
    const QRC = await generateQRCodeToURL(device_id)
    try {
      // Проверка на существование имени, если передано название поля
      if (tech_num) {
        const checkCommand = `SELECT COUNT(*) AS count FROM motors WHERE engine_number = ?
          AND workshop_id = ?`
        const checkResult = await executeDatabaseQueryAsync(checkCommand, [tech_num, workshop_id])

        if (checkResult[0].count > 0) {
          throw new Error(`Запись с таким ${tech_num} уже существует`) // Выбрасываем ошибку, если запись уже существует
        }
      }

      const command = `
      INSERT INTO motors (motor_id, engine_number, qr_code, type_id, workshop_id, department_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `
      await executeDatabaseQueryAsync(command, [device_id, tech_num, QRC, type_id, workshop_id, department_id])
    } catch (error) {
      console.error('Error creating new motor:', error)
      throw error
      // throw new Error('Ошибка запроса к базе данных')
    }
  }
  async updateMotorQ(data) {
    const { device_id, tech_num, workshop_id, department_id } = data
    // const QRC = await generateQRCodeToURL(device_id)
    try {
      // Проверка на существование имени, если передано название поля
      if (tech_num) {
        const checkCommand = `SELECT COUNT(*) AS count FROM motors WHERE engine_number = ?
          AND workshop_id = ?`
        const checkResult = await executeDatabaseQueryAsync(checkCommand, [tech_num, workshop_id])

        if (checkResult[0].count > 0) {
          throw new Error(`Запись с таким ${tech_num} уже существует`) // Выбрасываем ошибку, если запись уже существует
        }
      }

      const command = `
        UPDATE motors
        SET engine_number = ?, workshop_id = ?, department_id = ?
        WHERE motor_id = ?
      `
      await executeDatabaseQueryAsync(command, [tech_num, workshop_id, department_id, device_id])
    } catch (error) {
      console.error('Error creating new motor:', error)
      throw error
      // throw new Error('Ошибка запроса к базе данных')
    }
  }
  async deleteMotorsQ(motor_id) {
    try {
      const command = `
      DELETE FROM motors WHERE motor_id = ?
    `
      await executeDatabaseQueryAsync(command, [motor_id])
    } catch (error) {
      console.error('Error delete motor:', error)
      throw error
      // throw new Error('Ошибка запроса к базе данных')
    }
  }
  async takeMotorForRepairQ(motor_data) {
    try {
      // флаг для установки состояния двигателя
      const command = `
        UPDATE motors SET on_repair = TRUE WHERE motor_id = ?
      `
      await executeDatabaseQueryAsync(command, [motor_data.motor_id])

      // Запись в историю ремонта
      const historyCommand = `
        INSERT INTO motor_repair_history (motor_config_id, repair_start)
        VALUES (?, CURRENT_TIMESTAMP)
      `
      await executeDatabaseQueryAsync(historyCommand, [motor_data.motor_config_id])

      return true // Успешно выполнено
    } catch (error) {
      console.error('Error takeMotorForRepairQ motor:', error)
      throw error
      // throw new Error('Ошибка запроса к базе данных')
    }
  }
  async completeMotorRepairQ(motor_data) {
    try {
      const command = `
        UPDATE motors SET on_repair = FALSE WHERE motor_id = ?
      `
      await executeDatabaseQueryAsync(command, [motor_data.motor_id])

      // Запись в историю ремонта
      const historyCommand = `
        UPDATE motor_repair_history
        SET repair_end = CURRENT_TIMESTAMP
        WHERE motor_config_id = ?
      `
      await executeDatabaseQueryAsync(historyCommand, [motor_data.motor_config_id])
    } catch (error) {
      console.error('Error completeMotorRepairQ motor:', error)
      throw error
      // throw new Error('Ошибка запроса к базе данных')
    }
  }
  async getAllMotorsQ() {
    try {
      const command = `
        SELECT 
          m.motor_id AS motor_id, 
          m.id AS by_history_id,
          m.device_id, 
          m.devices_installation_date, 
          m.engine_number, 
          m.qr_code,
          m.on_repair, 
          dt.name AS type_name,
          w.id AS workshop_id, 
          w.name AS workshop_name,  
          dep.id AS department_id,
          dep.name AS department_name,
          mc.motor_config_id, 
          p.name AS power_value,
          mb.name AS brand_name,
          mm.name AS model_name,
          --(SELECT MAX(repair_end) FROM motor_repair_history WHERE motor_id = m.motor_id) AS last_repair_date
          COALESCE(
            DATETIME(
              (SELECT MAX(repair_end)
               FROM motor_repair_history 
               WHERE motor_id = m.id), 
              'localtime'), 
            'Нет данных') AS last_repair_date
        FROM 
          motors m
        LEFT JOIN devicesTypes dt ON m.type_id = dt.id
        LEFT JOIN workshops w ON m.workshop_id = w.id
        LEFT JOIN departments dep ON m.department_id = dep.id
        LEFT JOIN motors_config mc ON mc.motor_config_id = m.motor_config_id  
        LEFT JOIN motorPowerRangeT p ON p.id = mc.power_id
        LEFT JOIN motor_brands mb ON mc.brand_id = mb.id
        LEFT JOIN motor_models mm ON mc.model_id = mm.id
      `
      const results = await executeDatabaseQueryAsync(command)
      return results
    } catch (error) {
      console.error('Error fetching bucket elevators with details:', error)
      throw new Error('Ошибка запроса к базе данных')
    }
  }
  async readAllRepairsLogQ(motor_data) {
    console.log(motor_data)
    try {
      const command = `
        SELECT 
          DATETIME(repair_start, 'localtime') AS repair_start_local, 
          DATETIME(repair_end, 'localtime') AS repair_end_local 
        FROM motor_repair_history 
        WHERE motor_config_id = ?
      `
      const results = await executeDatabaseQueryAsync(command, [motor_data.motor_config_id])
      return results
    } catch (error) {
      console.error('Error fetching bucket elevators with details:', error)
      throw new Error('Ошибка запроса к базе данных')
    }
  }
}

module.exports = new MotorCRUD()

// const command = `
// SELECT
//   strftime('%d-%m-%Y %H:%M:%S', DATETIME(repair_start, 'localtime')) AS repair_start_local,
//   strftime('%d-%m-%Y %H:%M:%S', DATETIME(repair_end, 'localtime')) AS repair_end_local
// FROM motor_repair_history
// WHERE motor_id = ?
// `;
