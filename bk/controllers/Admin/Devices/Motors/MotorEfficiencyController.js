'use strict'

const { sendResponseWithData, handleError } = require('../../../../utils/response/responseUtils')
const BaseMotorController = require('./BaseMotorController')

class MotorEfficiencyController extends BaseMotorController {
  constructor() {
    super('MotorEfficiencyT') // Передаем имя таблицы в базовый класс
  }
  async doSomething(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      console.log('doSomething', data)
    //   await this.crud.createQ(data, { checkForExist: 'name' })
      sendResponseWithData(res, 'MotorEfficiencyController -create-ok')
    } catch (error) {
      handleError(res, 'Error: create MotorEfficiency - ' + error.message)
    }
  }
}

module.exports = new MotorEfficiencyController()

// !--------------------------------------------
// const GenericCRUD = require('../../../../Database/queries/GenericCRUD/GenericCRUD')
// class MotorAmperageController {
//   constructor() {
//     this.crud = new GenericCRUD('MotorAmperageT')
//     this.create = this.create.bind(this)
//     this.createPrFl = this.createPrFl.bind(this)
//     this.delete = this.delete.bind(this)
//     this.update = this.update.bind(this)
//     //! Привязка других методов...
//   }
//   async create(req, res) {
//     try {
//       const authDecodeUserData = req.user
//       const data = JSON.parse(authDecodeUserData.payLoad)
//       await this.crud.createQ(data, { checkForExist: 'name' })
//       sendResponseWithData(res, 'MotorAmperageController -create-ok')
//     } catch (error) {
//       handleError(res, 'Error: create MotorAmperage - ' + error.message)
//     }
//   }
//   async createPrFl(req, res) {
//     try {
//       const authDecodeUserData = req.user
//       const data = JSON.parse(authDecodeUserData.payLoad)
//       const allowedFields = ['name', 'power', 'type'] // Укажите разрешённые поля
//       await this.crud.createWithProtectFelidsQ(data, allowedFields) // Используйте метод с фильтрацией полей
//       sendResponseWithData(res, 'MotorAmperageController -create-ok')
//     } catch (error) {
//       handleError(res, 'Error: create MotorPowerRange - ' + error.message)
//     }
//   }

//   //!   Использование стрелочных функций
//   read = async (req, res) => {
//     try {
//       //   const id = req.query.id
//       const data = await this.crud.readQ()
//       sendResponseWithData(res, data)
//     } catch (error) {
//       handleError(res, 'Error: read MotorAmperage - ' + error.message)
//     }
//   }

//   async update(req, res) {
//     try {
//       const authDecodeUserData = req.user
//       const data = JSON.parse(authDecodeUserData.payLoad)
//       await this.crud.updateQ(data, { checkForExist: 'name' }) // Обновление записи
//       sendResponseWithData(res, 'MotorAmperageController -update-ok')
//     } catch (error) {
//       handleError(res, 'Error: update MotorAmperage - ' + error.message)
//     }
//   }

//   async delete(req, res) {
//     try {
//       const authDecodeUserData = req.user
//       const id = JSON.parse(authDecodeUserData.payLoad)
//       if (!id) {
//         throw new Error('ID is required for deletion')
//       }
//       await this.crud.deleteQ(id) // Удаление записи
//       sendResponseWithData(res, 'MotorAmperageController -delete-ok')
//     } catch (error) {
//       handleError(res, 'Error: delete MotorAmperage - ' + error.message)
//     }
//   }
// }

