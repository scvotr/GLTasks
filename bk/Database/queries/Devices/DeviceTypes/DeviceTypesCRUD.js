const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

class DeviceTypesCRUD {
  async createQ(data) {
     let { type_name } = data
    type_name = type_name.toLowerCase().trim()
    try {
      // Проверка на существование имени
      const checkCommand = `SELECT COUNT(*) AS count FROM devicesTypes WHERE name = ?`
      const checkResult = await executeDatabaseQueryAsync(checkCommand, [type_name])

      if (checkResult[0].count > 0) {
        throw new Error('Тип устройства с таким именем уже существует') // Выбрасываем ошибку, если имя уже существует
      }

      const command = `INSERT INTO devicesTypes (name) VALUES (?)`
      await executeDatabaseQueryAsync(command, [type_name])
    } catch (error) {
      console.error('Ошибка при создании типа устройства:', error)
      throw new Error('Ошибка запроса к базе данных при создании типа устройства')
    }
  }

  async updateQ(data) {
     let { id, type_name } = data
    type_name = type_name.toLowerCase().trim()
    try {
      // Проверка на существование имени, кроме текущего типа
      const checkCommand = `SELECT COUNT(*) AS count FROM devicesTypes WHERE name = ? AND id != ?`
      const checkResult = await executeDatabaseQueryAsync(checkCommand, [type_name, id])

      if (checkResult[0].count > 0) {
        throw new Error('Тип устройства с таким именем уже существует')
      }

      const command = `UPDATE devicesTypes SET name = ? WHERE id = ?`
      await executeDatabaseQueryAsync(command, [type_name, id])
    } catch (error) {
      console.error('Ошибка при обновлении типа устройства:', error)
      throw new Error('Ошибка запроса к базе данных при обновлении типа устройства')
    }
  }

  async readQ() {
      try {
      const command = `SELECT * FROM devicesTypes`
      const rows = await executeDatabaseQueryAsync(command, [])
      return rows
    } catch (error) {
      console.error('Ошибка при чтении типов устройств:', error)
      throw new Error('Ошибка запроса к базе данных при чтении типов устройств')
    }
  }

  async deleteQ(id) {
      try {
      const command = `DELETE FROM devicesTypes WHERE id = ?`
      await executeDatabaseQueryAsync(command, [id])
    } catch (error) {
      console.error('Ошибка при удалении типа устройства:', error)
      throw new Error('Ошибка запроса к базе данных при удалении типа устройства')
    }
  }
}

module.exports = new DeviceTypesCRUD()
