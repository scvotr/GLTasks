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
}

module.exports = new LabAnalyticsController()
