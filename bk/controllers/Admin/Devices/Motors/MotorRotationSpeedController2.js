'use strict'

const { sendResponseWithData, handleError } = require('../../../../utils/response/responseUtils')
const BaseMotorController = require('./BaseMotorController')

class MotorRotationSpeedController2 extends BaseMotorController {
  constructor() {
    super('MotorRotationSpeedT') // Передаем имя таблицы в базовый класс
  }
  // async doSomething(req, res) {
  //   try {
  //     const authDecodeUserData = req.user
  //     const data = JSON.parse(authDecodeUserData.payLoad)
  //     console.log('doSomething', data)
  //   //   await this.crud.createQ(data, { checkForExist: 'name' })
  //     sendResponseWithData(res, 'MotorRotationSpeedController -create-ok')
  //   } catch (error) {
  //     handleError(res, 'Error: create MotorRotationSpeed - ' + error.message)
  //   }
  // }
}

module.exports = new MotorRotationSpeedController2()