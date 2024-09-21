'use strict'

const MotorsMotorPowerCRUD = require('../../../../Database/queries/Devices/MotorsMotorPowerCRUD')

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

class MotorPowerRangeController {
  async create(req, res) {
    try {
      const authDecodeUserData = req.user
      await MotorsMotorPowerCRUD.createQ(JSON.parse(authDecodeUserData.payLoad)) 
      sendResponseWithData(res, 'MotorPowerRangeController-create-ok')
    } catch (error) {
      handleError(res, 'Error: createMotorPowerRange - ' + error.message) 
    }
  }

  async read(req, res) {
    try {
      // const authDecodeUserData = req.user
      // Нужно нормально передать ID в payload
      // const id = req.query.id // предполагается, что id передается через query-параметры
      const data = await MotorsMotorPowerCRUD.readQ() // передаем id в readQ
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: readMotorPowerRange - ' + error.message) 
    }
  }

  async update(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      if (!data.id) {
        throw new Error('ID is required for updating')
      }
      await MotorsMotorPowerCRUD.updateQ(data)
      sendResponseWithData(res, 'updateMotorPowerRange - OK!')
    } catch (error) {
      handleError(res, 'Error: updateMotorPowerRange - ' + error.message) 
    }
  }

  async delete(req, res) {
    try {
      const authDecodeUserData = req.user
      const id = JSON.parse(authDecodeUserData.payLoad)
      if (!id) {
        throw new Error('ID is required for deletion')
      }
      await MotorsMotorPowerCRUD.deleteQ(id)
      sendResponseWithData(res, 'deleteMotorPowerRange - OK!') 
    } catch (error) {
      handleError(res, 'Error: deleteMotorPowerRange - ' + error.message) 
    }
  }
}

module.exports = new MotorPowerRangeController()
