const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery')

class MotorsMotorPowerCRUD {
  async createQ(data) {
    const { name } = data
    try {
      // Проверка на существование имени
      const checkCommand = `SELECT COUNT(*) AS count FROM motorPowerRangeT WHERE name = ?`
      const checkResult = await executeDatabaseQueryAsync(checkCommand, [name])

      if (checkResult[0].count > 0) {
        throw new Error('Тип устройства с таким именем уже существует') // Выбрасываем ошибку, если имя уже существует
      }

      const command = `
        INSERT INTO motorPowerRangeT (name)
        VALUES (?)
      `
      await executeDatabaseQueryAsync(command, [name])
    } catch (error) {
      console.error('Error creating new powerRange:', error)
      throw new Error('Ошибка создания нового диапазона мощности: ' + error.message)
    }
  }

  async readQ(id) {
    try {
      let command
      let params = []

      if (id) {
        command = `SELECT * FROM motorPowerRangeT WHERE id = ?`
        params = [id]
      } else {
        command = `SELECT * FROM motorPowerRangeT`
      }

      const result = await executeDatabaseQueryAsync(command, params)
      return result
    } catch (error) {
      console.error('Error reading powerRange:', error)
      throw new Error('Ошибка чтения диапазона мощности: ' + error.message)
    }
  }

  async updateQ(data) {
    const { id, name } = data
    try {
      // Проверка на существование имени
      const checkCommand = `SELECT COUNT(*) AS count FROM motorPowerRangeT WHERE name = ?`
      const checkResult = await executeDatabaseQueryAsync(checkCommand, [name])

      if (checkResult[0].count > 0) {
        throw new Error('Тип устройства с таким именем уже существует') // Выбрасываем ошибку, если имя уже существует
      }
      const command = `
        UPDATE motorPowerRangeT SET name = ? WHERE id = ?
      `
      await executeDatabaseQueryAsync(command, [name, id])
    } catch (error) {
      console.error('Error updating powerRange:', error)
      throw new Error('Ошибка обновления диапазона мощности: ' + error.message)
    }
  }

  async deleteQ(id) {
    try {
      const command = `
        DELETE FROM motorPowerRangeT WHERE id = ?
      `
      await executeDatabaseQueryAsync(command, [id])
    } catch (error) {
      console.error('Error deleting powerRange:', error)
      throw new Error('Ошибка удаления диапазона мощности: ' + error.message)
    }
  }
}

module.exports = new MotorsMotorPowerCRUD()
