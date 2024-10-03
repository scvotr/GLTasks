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
      console.error('Error creating new device:', error)
      throw new Error('Ошибка запроса к базе данных')
    }
  }
  async getAllMotorsQ() {
    try {
      const command = `
      SELECT 
        m.motor_id AS motor_id, 
        m.device_id, 
        m.devices_installation_date, 
        m.engine_number, 
        m.qr_code, 
        dt.name AS type_name,
        w.name AS workshop_name,  
        dep.name AS department_name,
        mc.power_id, 
        p.name AS power_value
      FROM 
        motors m
      LEFT JOIN devicesTypes dt ON m.type_id = dt.id
      LEFT JOIN workshops w ON m.workshop_id = w.id
      LEFT JOIN departments dep ON m.department_id = dep.id
      LEFT JOIN motors_config mc ON mc.id = m.motor_config_id  
      LEFT JOIN motorPowerRangeT p ON p.id = mc.power_id
      `
      const results = await executeDatabaseQueryAsync(command)
      return results
    } catch (error) {
      console.error('Error fetching bucket elevators with details:', error)
      throw new Error('Ошибка запроса к базе данных')
    }
  }
}

module.exports = new MotorCRUD()
