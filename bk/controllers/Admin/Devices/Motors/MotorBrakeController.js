'use strict'

const { sendResponseWithData, handleError } = require('../../../../utils/response/responseUtils')
const BaseMotorController = require('./BaseMotorController')

class MotorBrakeController extends BaseMotorController {
  constructor() {
    super('MotorBrakeT') // Передаем имя таблицы в базовый класс
  }
}

module.exports = new MotorBrakeController()