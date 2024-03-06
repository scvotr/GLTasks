const OrgStructControler = require('../controllers/orgStruct/OrgStructControler');
const { handleDefaultRoute } = require("../routingHandlers/handleDefaultRoute");
const { protectRouteTkPl } = require("../utils/protectRouteTkPl");

const routeHandlers = {
  "/orgStruct/getDepartments": OrgStructControler.getDepartments,
  "/orgStruct/getSubDepartmentsByID": OrgStructControler.getSubDepartmentsByID,
  "/orgStruct/getPositionsByID": OrgStructControler.getPositionsByID,
  "/orgStruct/getPositions": OrgStructControler.getPositions,
  "/orgStruct/getUserByPositionId": OrgStructControler.getUserByPositionId,
  // "/orgStruct/getDepartmentsByID": OrgStructControler.getDepartmentsByID,
  // "/orgStruct/getDepartmentsFrom": OrgStructControler.getDepartmentsFrom,
  // "/orgStruct/getSubDepartments": OrgStructControler.getSubDepartments,
  // "/orgStruct/getAllWorkshops": OrgStructControler.getAllWorkshops,
  // "/orgStruct/getWorkshopsByDepID": OrgStructControler.getWorkshopsByDepID,
};

const handleOrgStructRoutes = async (req, res) => {
  const { url, method } = req;
  
  try {
    if (url.startsWith("/orgStruct")) {
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
    res.end(JSON.stringify({ error: "handleOrgStructRoutes - ОШИБКА" }));
  }
};

module.exports = {
  handleOrgStructRoutes
};
