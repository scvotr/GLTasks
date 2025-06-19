'use strict'
const LabAnalyticQueries = require('../../Database/queries/Lab/Analytics/LabAnalyticQueries')
const { handleError, sendResponseWithData } = require('../../utils/response/responseUtils')

class LabAnalyticsController {
  async getData(req, res) {
    try {
      const result = await LabAnalyticQueries.getDataQ()
      sendResponseWithData(res, result)
    } catch (error) {
      handleError(res, `getData-Error`)
    }
  }
  async getRequestByID(req, res) {
    try {
      const authDecodeUserData = req.user
      const request_id = JSON.parse(authDecodeUserData.payLoad)
      const result = await LabAnalyticQueries.getRequestByIDQ(request_id)
      sendResponseWithData(res, result)
    } catch (error) {
      handleError(res, `getRequestByID-Error`)
    }
  }
}

module.exports = new LabAnalyticsController()
