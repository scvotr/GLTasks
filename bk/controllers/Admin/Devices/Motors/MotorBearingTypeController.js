'use strict'

const { sendResponseWithData, handleError } = require('../../../../utils/response/responseUtils')
const BaseMotorController = require('./BaseMotorController')

class MotorBearingTypeController extends BaseMotorController {
  constructor() {
    super('BearingTypeT') // Передаем имя таблицы в базовый класс
  }
}

module.exports = new MotorBearingTypeController()