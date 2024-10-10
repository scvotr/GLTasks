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
      handleError(res, `Error: createMotor - ${error.message}`) // Передаем сообщение об ошибке клиенту
    }
  }
  async updateMotor(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await MotorCRUD.updateMotorQ(data)
      sendResponseWithData(res, 'updateMotor-ok')
    } catch (error) {
      handleError(res, `Error: updateMotor - ${error.message}`) // Передаем сообщение об ошибке клиенту
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
  async deleteMotors(req, res) {
    try {
      const authDecodeUserData = req.user
      const motor_id = JSON.parse(authDecodeUserData.payLoad)
      await MotorCRUD.deleteMotorsQ(motor_id)
      sendResponseWithData(res, `Успешно удален ${motor_id}`)
    } catch (error) {
      handleError(res, 'Error: readAllDevices')
    }
  }

  async takeMotorForRepair(req, res) {
    try {
      const authDecodeUserData = req.user
      const motor_id = JSON.parse(authDecodeUserData.payLoad)
      await MotorCRUD.takeMotorForRepairQ(motor_id)
      sendResponseWithData(res, `Принят в ремонт ${motor_id}`)
    } catch (error) {
      handleError(res, 'Error: readAllDevices')
    }
  }
  async completeMotorRepair(req, res) {
    try {
      const authDecodeUserData = req.user
      const motor_id = JSON.parse(authDecodeUserData.payLoad)
      await MotorCRUD.completeMotorRepairQ(motor_id)
      sendResponseWithData(res, `Ремонт завершён ${motor_id}`)
    } catch (error) {
      handleError(res, 'Error: readAllDevices')
    }
  }
}

module.exports = new MotorController()
