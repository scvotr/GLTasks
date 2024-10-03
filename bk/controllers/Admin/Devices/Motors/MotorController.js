'use strict'

const MotorCRUD = require('../../../../Database/queries/Devices/Motors/MotorCRUD')
const MotorConfigCRUD = require('../../../../Database/queries/Devices/Motors/MotorConfigCRUD')
const { createMotorQ } = require('../../../../Database/queries/Devices/Motors/MotorConfigCRUD')
const { handleError, sendResponseWithData } = require('../../../../utils/response/responseUtils')
const BaseMotorController = require('./BaseMotorController')

class MotorController extends BaseMotorController {
  constructor() {
    super('motors')
  }
  async createMotor(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await MotorCRUD.createMotorQ(data)
      sendResponseWithData(res, 'createMotor-ok')
    } catch (error) {
      handleError(res, 'Error: createMotor')
    }
  }
  async readAllMotors(req, res) {
    try {
      const data = await MotorCRUD.getAllMotorsQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: readAllDevices')
    }
  }
}

module.exports = new MotorController()
