'use strict'

const BaseMotorController = require('./BaseMotorController')

class MotorTechUnitController extends BaseMotorController {
  constructor() {
    super('motors')
  }
}

module.exports = new MotorTechUnitController()
