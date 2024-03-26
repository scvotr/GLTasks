'use strict'

const UserController = require("../controllers/User/UserController");
const { handleDefaultRoute } = require("./handleDefaultRoute");
const { protectRouteTkPl } = require("../utils/protectRouteTkPl");

const routeHandlers = {
  "/user/getUserById": UserController.getUserById,
  "/user/editUserData": UserController.editUserData,
};

const handleUserRoutes = async (req, res) => {
  const { url, method } = req;
  
  try {
    if (url.startsWith("/user")) {
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
    res.end(JSON.stringify({ error: "handleUserRoutes - ERROR" }));
  }
};

module.exports = {
  handleUserRoutes,
};