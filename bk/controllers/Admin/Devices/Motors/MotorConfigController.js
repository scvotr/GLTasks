'use strict'

const MotorConfigCRUD = require('../../../../Database/queries/Devices/Motors/MotorConfigCRUD')
const { sendResponseWithData, handleError } = require('../../../../utils/response/responseUtils')
const BaseMotorController = require('./BaseMotorController')

class MotorConfigController extends BaseMotorController {
  constructor() {
    super('motors_config') // Передаем имя таблицы в базовый класс
  }
  async createMotorConfig(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      // console.log('createMotorConfig', data)
      await MotorConfigCRUD.createConfigQ(data)
      sendResponseWithData(res, 'createMotorConfig -create-ok')
    } catch (error) {
      handleError(res, 'Error: create MotorAmperage - ' + error.message)
    }
  }
  async readAllMotorConfigs(req, res) {
    console.log('ddd')
    try {
      const data = await MotorConfigCRUD.readAllConfigsQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: create MotorAmperage - ' + error.message)
    }
  }
}

module.exports = new MotorConfigController()