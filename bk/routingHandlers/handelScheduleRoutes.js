const ScheduleController = require("../controllers/Schedule/ScheduleController");
const { handleDefaultRoute } = require("../routingHandlers/handleDefaultRoute");
const { protectRouteTkPl } = require("../utils/protectRouteTkPl");


const routeHandlers = {
  "/schedule/addSchedules": ScheduleController.addNewSchedules,
  "/schedule/updateSchedule": ScheduleController.updateSchedule,
  "/schedule/removeSchedule": ScheduleController.removeSchedule,
  "/schedule/getAllSchedulesByUserId": ScheduleController.getAllSchedulesByUserId,
  "/schedule/getAllSchedulesBySubDepId": ScheduleController.getAllSchedulesBySubDepId,
}

const handelScheduleRoutes = async(req, res) => {
  const { url, method } = req;
  try {
    if (url.startsWith("/schedule")) {
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
    res.end(JSON.stringify({ error: "handelScheduleRoutes - ERROR" }));
  }
}

module.exports = {
  handelScheduleRoutes
};