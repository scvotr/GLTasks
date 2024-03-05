const UserControler = require("../controllers/Admin/UserControler")
// const DepsControler = require('../controls/Admin/Deps/DepsControler')
const { handleDefaultRoute } = require("../routingHandlers/handleDefaultRoute")
const { protectRouteTkPl } = require("../utils/protectRouteTkPl")

const routeHandlers = {
  "/admin/getAllUsers": UserControler.getAllUsers,
  "/admin/updateUserData": UserControler.updateUserData,
  // "/admin/getAllTasks": UserControler.getAllTasks,
  // "/admin/createNewDep": DepsControler.createNewDep,
  // "/admin/removeDep": DepsControler.removeDep,
  // "/admin/createNewSubDep": DepsControler.createNewSubDep,
  // "/admin/createNewPosition": DepsControler.createNewPosition,
};

const handleAdminRoutes = async (req, res) => {
  const { url, method } = req;
  
  try {
    if (url.startsWith("/admin")) {
      const routeHandler = routeHandlers[url];
      if (routeHandler) {
        if (method === "POST") {
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
    res.end(JSON.stringify({ error: "handleAdminRoutes - ERROR" }));
  }
};

module.exports = { handleAdminRoutes };
