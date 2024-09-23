'use strict'

const { executeDatabaseQueryAsync } = require('../../../../Database/utils/executeDatabaseQuery/executeDatabaseQuery')
const { sendResponseWithData, handleError } = require('../../../../utils/response/responseUtils')
const BaseMotorController = require('./BaseMotorController')

class MotorModelsController extends BaseMotorController {
  constructor() {
    super('motor_models') // Передаем имя таблицы в базовый класс
  }
  async readAll(req, res) {
    try {
      const command = `
        SELECT mm.id, mm.name AS model_name, mb.id AS brand_id, mb.name AS brand_name
        FROM motor_brands mb
        JOIN motor_models mm ON mb.id = mm.brand_id
      `
      const data = await executeDatabaseQueryAsync(command, [])
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: read Motor Models - ' + error.message)
    }
  }
}

module.exports = new MotorModelsController()
