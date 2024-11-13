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
      // await MotorConfigCRUD.createMotorQ(data)
      await MotorConfigCRUD.createConfigQ(data)
      sendResponseWithData(res, 'createMotorConfig -create-ok')
    } catch (error) {
      handleError(res, 'Error: create createMotorConfig - ' + error.message)
    }
  }
  async readAllMotorConfigs(req, res) {
    try {
      const data = await MotorConfigCRUD.readAllConfigsQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: create readAllMotorConfigs - ' + error.message)
    }
  }
  async readAllConfig(req, res) {
    try {
      const data = await MotorConfigCRUD.readAllConfigQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: create readAllConfig - ' + error.message)
    }
  }
  async readAllConfigUninstall(req, res) {
    try {
      const data = await MotorConfigCRUD.readAllConfigUninstallQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: create readAllConfig - ' + error.message)
    }
  }
  async readAllConfigInstall(req, res) {
    try {
      const data = await MotorConfigCRUD.readAllConfigInstallQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: create readAllConfig - ' + error.message)
    }
  }
  async appendConfigToMotor(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await MotorConfigCRUD.appendConfigToMotorQ(data)
      sendResponseWithData(res, 'data')
    } catch (error) {
      handleError(res, 'Error: create appendConfigToMotor - ' + error.message)
    }
  }
  async removeConfigFromMotor(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await MotorConfigCRUD.removeConfigFromMotorQ(data)
      sendResponseWithData(res, 'data')
    } catch (error) {
      handleError(res, 'Error: create appendConfigToMotor - ' + error.message)
    }
  }
  async removeConfigForStorage(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await MotorConfigCRUD.removeConfigForStorageQ(data)
      sendResponseWithData(res, 'data')
    } catch (error) {
      handleError(res, 'Error: create appendConfigToMotor - ' + error.message)
    }
  }
  async readMotorConfigs(req, res) {
    try {
      const authDecodeUserData = req.user
      const device_id = JSON.parse(authDecodeUserData.payLoad)
      const data = await MotorConfigCRUD.readConfigsQ(device_id)
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: create MotorAmperage - ' + error.message)
    }
  }
  async readAllMotor(req, res) {
    try {
      const data = await MotorConfigCRUD.readAllMotorsQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: create MotorAmperage - ' + error.message)
    }
  }

  async deleteMotorConfig(req, res) {
    try {
      const authDecodeUserData = req.user
      const device_id = JSON.parse(authDecodeUserData.payLoad)
      await MotorConfigCRUD.deleteMotorConfigQ(device_id)
      sendResponseWithData(res, 'motor config delete ok')
    } catch (error) {
      handleError(res, 'Error: create MotorAmperage - ' + error.message)
    }
  }
}

module.exports = new MotorConfigController()
