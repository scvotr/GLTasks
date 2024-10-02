'use strict'

const BaseMotorController = require('./BaseMotorController')

class MotorController extends BaseMotorController {
  constructor() {
    super('motors')
  }
}

module.exports = new MotorController()
