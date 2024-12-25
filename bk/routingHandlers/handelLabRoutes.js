const { handleDefaultRoute } = require("./handleDefaultRoute");
const { protectRouteTkPl } = require("../utils/protectRouteTkPl");
const LabController = require("../controllers/Lab/LabController");


const routeHandlers = {
  "/lab/createReqForAvailability": LabController.addNewLabsReqForAvailability,
  "/lab/getAllRequestsWithApprovals": LabController.getAllRequestsWithApprovals,
  "/lab/getUserConfirmation": LabController.getUserConfirmation,
  "/lab/updateReadStatus": LabController.updateReadStatus,
  "/lab/addFilesForRequest": LabController.addFilesForRequest,
}

const handelLabRoutes = async(req, res) => {
  const { url, method } = req;
  try {
    if (url.startsWith("/lab")) {
      if (method === "POST") {
        const routeHandler = routeHandlers[url];
        if (routeHandler) {
          await protectRouteTkPl(routeHandler)(req, res);
        } else {
          handleDefaultRoute(req, res);
        }
      } else {
        handleDefaultRoute(req, res);
      }
    } else {
      handleDefaultRoute(req, res);
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "handelLabRoutes - ERROR" }));
  }
}

module.exports = {
  handelLabRoutes
};