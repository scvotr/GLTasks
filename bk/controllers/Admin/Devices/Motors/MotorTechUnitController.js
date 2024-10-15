'use strict'

const BaseMotorController = require('./BaseMotorController')

class MotorTechUnitController extends BaseMotorController {
  constructor() {
    super('motor_tech_units')
  }
}

module.exports = new MotorTechUnitController()
