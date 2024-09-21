'use strict'

const { sendResponseWithData, handleError } = require('../../../../utils/response/responseUtils')
const BaseMotorController = require('./BaseMotorController')

class MotorExplosionProofController extends BaseMotorController {
  constructor() {
    super('MotorExplosionProofT') // Передаем имя таблицы в базовый класс
  }
}

module.exports = new MotorExplosionProofController()