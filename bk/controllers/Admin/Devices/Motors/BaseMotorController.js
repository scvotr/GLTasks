'use strict'
const GenericCRUD = require('../../../../Database/queries/GenericCRUD/GenericCRUD')
const { sendResponseWithData, handleError } = require('../../../../utils/response/responseUtils')

class BaseMotorController {
  constructor(tableName) {
    this.crud = new GenericCRUD(tableName)
    this.create = this.create.bind(this)
    this.createPrFl = this.createPrFl.bind(this)
    this.delete = this.delete.bind(this)
    this.update = this.update.bind(this)
    this.tableName = tableName // Сохраняем имя таблицы
  }

  async create(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await this.crud.createQ(data, { checkForExist: 'name' })
      sendResponseWithData(res, `${this.tableName} - create-ok`)
    } catch (error) {
      handleError(res, `Error: create ${this.tableName} - ${error.message}`)
    }
  }

  async createPrFl(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      const allowedFields = ['name', 'power', 'type'] // Укажите разрешённые поля
      await this.crud.createWithProtectFelidsQ(data, allowedFields)
      sendResponseWithData(res, `${this.tableName} - create-ok`)
    } catch (error) {
      handleError(res, `Error: create ${this.tableName} - ${error.message}`)
    }
  }

  read = async (req, res) => {
    try {
      const data = await this.crud.readQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, `Error: read ${this.tableName} - ${error.message}`)
    }
  }

  async update(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await this.crud.updateQ(data, { checkForExist: 'name' })
      sendResponseWithData(res, `${this.tableName} - update-ok`)
    } catch (error) {
      handleError(res, `Error: update ${this.tableName} - ${error.message}`)
    }
  }

  async delete(req, res) {
    try {
      const authDecodeUserData = req.user
      const id = JSON.parse(authDecodeUserData.payLoad)
      if (!id) {
        throw new Error('ID is required for deletion')
      }
      await this.crud.deleteQ(id)
      sendResponseWithData(res, `${this.tableName} - delete-ok`)
    } catch (error) {
      handleError(res, `Error: delete ${this.tableName} - ${error.message}`)
    }
  }
}

module.exports = BaseMotorController // Экспортируем класс
// module.exports = new BaseMotorController() // Экспортируем экземпляр
