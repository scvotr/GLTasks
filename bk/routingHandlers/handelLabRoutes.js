const { handleDefaultRoute } = require('./handleDefaultRoute')
const { protectRouteTkPl } = require('../utils/protectRouteTkPl')
const LabController = require('../controllers/Lab/LabController')
const LabAnalyticsController = require('../controllers/Lab/LabAnalyticsController')

const routeHandlers = {
  '/lab/createReqForAvailability': LabController.addNewLabsReqForAvailability,
  '/lab/getAllRequestsWithApprovals': LabController.getAllRequestsWithApprovals,
  '/lab/getUserConfirmation': LabController.getUserConfirmation,
  '/lab/updateReadStatus': LabController.updateReadStatus,
  '/lab/addFilesForRequest': LabController.addFilesForRequest,
  '/lab/deleteReqForLab': LabController.deleteReqForLab,
  '/lab/addNewLabReqComment': LabController.addNewLabReqComment,
  '/lab/getAllLabReqComment': LabController.getAllLabReqComment,
  '/lab/getAllLabReqFiles': LabController.getAllLabReqFiles,
  '/lab/getPreviewFileContent': LabController.getPreviewLabReqFileContent,
  '/lab/getFullFileContent': LabController.getFullFileContent,
  '/lab/deleteFile': LabController.deleteFile,
  '/lab/updateReqStatus': LabController.updateReqStatus,
  '/lab/addReport': LabController.addReport,
  '/lab/getContractors': LabController.getContractors,
  '/lab/addContractor': LabController.addContractor,
  '/lab/getRequestForRepeat': LabController.getRequestForRepeat,
  // -----------------
  '/lab/analytics/getData': LabAnalyticsController.getData,
}

const handelLabRoutes = async (req, res) => {
  const { url, method } = req
  try {
    if (url.startsWith('/lab')) {
      if (method === 'POST') {
        const routeHandler = routeHandlers[url]
        if (routeHandler) {
          await protectRouteTkPl(routeHandler)(req, res)
        } else {
          handleDefaultRoute(req, res)
        }
      } else {
        handleDefaultRoute(req, res)
      }
    } else {
      handleDefaultRoute(req, res)
    }
  } catch (error) {
    console.error(error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'handelLabRoutes - ERROR' }))
  }
}

module.exports = {
  handelLabRoutes,
}
