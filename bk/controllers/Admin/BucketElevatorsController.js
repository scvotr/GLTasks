'use strict'

const DeviceCRUD = require('../../Database/queries/Devices/DeviceCRUD')
const {
  readAllBeltBrandsQ,
  readAllBucketBrandsQ,
  readAllGearboxBrandsQ,
  readAllBucketElevatorsQ,
  readAllBeltReplacementHistoryQ,
  readAllBucketReplacementHistoryQ,
  readAllGearboxReplacementHistoryQ,
  createBucketElevatorQ,
  readAllDriveBeltsBrandsQ,
} = require('../../Database/queries/Machine/BucketElevatorsCRUD')
const { sendResponseWithData, handleError } = require('../../utils/response/responseUtils')

class BucketElevatorsController {
  async createBucketElevator(req, res) {
    try {
      const authDecodeUserData = req.user
      // создаем отдельно устройство
      await DeviceCRUD.createDeviceQ(JSON.parse(authDecodeUserData.payLoad))
      await DeviceCRUD.createBucketElevatorQ(JSON.parse(authDecodeUserData.payLoad))
      if (JSON.parse(authDecodeUserData.payLoad).motor_config_id) {
        // ! Что добовляется? Мотор или конфиг?!?!?! ДОБАВЛЯЕМ МОТОР ЗАЧЕМ?
        await DeviceCRUD.appendMotorQ(JSON.parse(authDecodeUserData.payLoad))
      }
      sendResponseWithData(res, 'createBucketElevator-ok')
    } catch (error) {
      handleError(res, 'Error: createBucketElevator')
    }
  }
  async getAllBucketElevators(req, res) {
    try {
      const data = await DeviceCRUD.getAllBucketElevatorsWithDetailsQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: createBucketElevator')
    }
  }
  async getBucketElevator(req, res) {
    try {
      const authDecodeUserData = req.user
      const device = JSON.parse(authDecodeUserData.payLoad)
      const data = await DeviceCRUD.getBucketElevatorQ(device.id)
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: createBucketElevator')
    }
  }
  // --------------------------------------------
  async readAllBeltBrands(req, res) {
    try {
      const data = await readAllBeltBrandsQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: readAllBeltBrands')
    }
  }
  async readAllBucketBrands(req, res) {
    try {
      const data = await readAllBucketBrandsQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: readAllBucketBrands')
    }
  }
  async readAllGearboxBrands(req, res) {
    try {
      const data = await readAllGearboxBrandsQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: readAllGearboxBrands')
    }
  }
  async readAllDriveBelts(req, res) {
    try {
      const data = await readAllDriveBeltsBrandsQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: readAllDriveBelts')
    }
  }
  async readAllBeltReplacementHistory(req, res) {
    try {
      const data = await readAllBeltReplacementHistoryQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: readAllBeltReplacementHistory')
    }
  }
  async readAllBucketReplacementHistory(req, res) {
    try {
      const data = await readAllBucketReplacementHistoryQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: readAllBucketReplacementHistory')
    }
  }
  async readAllGearboxReplacementHistory(req, res) {
    try {
      const data = await readAllGearboxReplacementHistoryQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: readAllGearboxReplacementHistory')
    }
  }
}

// "/admin/machines/bucketElevators/create": BucketElevatorsController.createBucketElevator,
// "/admin/machines/bucketElevators/update": BucketElevatorsController.updateBucketElevator,
// "/admin/machines/bucketElevators/delete": BucketElevatorsController.deleteBucketElevator,
// "/admin/machines/bucketElevators/readOnce": BucketElevatorsController.readOnceBucketElevator,

module.exports = new BucketElevatorsController()
