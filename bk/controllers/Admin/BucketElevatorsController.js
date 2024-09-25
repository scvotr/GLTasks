'use strict'

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
