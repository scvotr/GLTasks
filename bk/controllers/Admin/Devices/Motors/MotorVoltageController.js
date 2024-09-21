'use strict'
const GenericCRUD = require('../../../../Database/queries/GenericCRUD/GenericCRUD')

const sendResponseWithData = (res, data) => {
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify(data))
  res.end()
}

const handleError = (res, error) => {
  console.error('handleError', error)
  res.statusCode = 500
  res.end(
    JSON.stringify({
      error: error,
    })
  )
}

class MotorVoltageController {
  constructor() {
    this.crud = new GenericCRUD('motorVoltageT')
    this.create = this.create.bind(this)
    this.createPrFl = this.createPrFl.bind(this)
    this.delete = this.delete.bind(this)
    this.update = this.update.bind(this)
    //! Привязка других методов...
  }
  async create(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await this.crud.createQ(data, { checkForExist: 'name' })
      sendResponseWithData(res, 'MotorVoltageController -create-ok')
    } catch (error) {
      handleError(res, 'Error: createMotorVoltage - ' + error.message)
    }
  }
  async createPrFl(req, res) {
    try {
      const authDecodeUserData = req.user;
      const data = JSON.parse(authDecodeUserData.payLoad);
      const allowedFields = ['name', 'power', 'type']; // Укажите разрешённые поля
      await this.crud.createWithProtectFelidsQ(data, allowedFields); // Используйте метод с фильтрацией полей
      sendResponseWithData(res, 'MotorVoltageController -create-ok');
    } catch (error) {
      handleError(res, 'Error: createMotorPowerRange - ' + error.message);
    }
  }
  
  //!   Использование стрелочных функций
  read = async (req, res) => {
    try {
      //   const id = req.query.id
      const data = await this.crud.readQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: readMotorVoltage - ' + error.message)
    }
  }

  async update(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await this.crud.updateQ(data, { checkForExist: 'name' }) // Обновление записи
      sendResponseWithData(res, 'MotorVoltageController -update-ok')
    } catch (error) {
      handleError(res, 'Error: updateMotorVoltage - ' + error.message)
    }
  }

  async delete(req, res) {
    try {
      const authDecodeUserData = req.user
      const id = JSON.parse(authDecodeUserData.payLoad)
      if (!id) {
        throw new Error('ID is required for deletion')
      }
      await this.crud.deleteQ(id) // Удаление записи
      sendResponseWithData(res, 'Motor VoltageController -delete-ok')
    } catch (error) {
      handleError(res, 'Error: deleteMotorVoltage - ' + error.message)
    }
  }
}

module.exports = new MotorVoltageController()

// async create(req, res) {
//     try {
//       const authDecodeUserData = req.user;
//       const data = JSON.parse(authDecodeUserData.payLoad);
//       const allowedFields = ['name', 'power', 'type']; // Укажите разрешённые поля
//       await this.crud.createWithProtectFelidsQ(data, allowedFields); // Используйте метод с фильтрацией полей
//       sendResponseWithData(res, 'MotorPowerRangeController-create-ok');
//     } catch (error) {
//       handleError(res, 'Error: createMotorPowerRange - ' + error.message);
//     }
//   }
