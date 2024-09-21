'use strict'

const { sendResponseWithData, handleError } = require('../../../../utils/response/responseUtils')
const BaseMotorController = require('./BaseMotorController')

class MotorProtectionLevelController extends BaseMotorController {
  constructor() {
    super('MotorProtectionLevelT') // Передаем имя таблицы в базовый класс
  }
}

module.exports = new MotorProtectionLevelController()