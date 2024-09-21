const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery')
const QRCode = require('qrcode')

const generateQRCode = async machineId => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(machineId)
    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

const generateQRCodeToURL = async machineId => {
  try {
    // Формируем URL с использованием machineId
    const baseURL = 'http://192.168.0.27:3001/admin/machines/' // Замените на ваш базовый URL
    const url = `${baseURL}${machineId}`

    // Генерируем QR-код для URL
    const qrCodeDataURL = await QRCode.toDataURL(url)
    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

const generateQRCodeToBuffer = async machineId => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(machineId)
    // Удаляем префикс 'data:image/png;base64,' из Data URL
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '')
    // Конвертируем Base64 строку в Buffer
    return Buffer.from(base64Data, 'base64')
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

const createNewMachineQ = async data => {
  const { machine_id, tech_num, type_id, dep_id, power_perform_id, workshop_id } = data
  const QRC = await generateQRCodeToURL(machine_id)
  try {
    // SQL-запрос для вставки данных о механизме
    const command = `
      INSERT INTO venchels (venchel_id, tech_num, type_id, department_id, power_perform_id, workshop_id, qr_code)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    // Выполнение запроса
    await executeDatabaseQueryAsync(command, [machine_id, tech_num, type_id, dep_id, power_perform_id, workshop_id, QRC])
  } catch (error) {
    // Логирование и выброс ошибки
    console.error('Error creating new machine:', error)
    throw new Error('Ошибка запроса к базе данных')
  }
}



module.exports = { createNewMachineQ }
