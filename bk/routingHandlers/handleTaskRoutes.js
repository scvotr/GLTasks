const TasksControler = require('../controllers/Tasks/TasksControler');
const { handleDefaultRoute } = require("../routingHandlers/handleDefaultRoute");
const { protectRouteTkPl } = require("../utils/protectRouteTkPl");

const routeHandlers = {
  "/tasks/addNewTask": TasksControler.addNewTask,
  "/tasks/updateReadStatus": TasksControler.updateReadStatus,
  "/tasks/getAllTasksBySubDep": TasksControler.getAllTasksBySubDep,
  "/tasks/updateTaskStatus": TasksControler.updateTaskStatus,
  "/tasks/updateTaskStatusNew": TasksControler.updateTaskStatusNew,
  "/tasks/getAllUserTasks": TasksControler.getAllUserTasks,
  "/tasks/removeTask": TasksControler.removeTask,
  "/tasks/updateTaskSetResponsibleUser": TasksControler.updateTaskSetResponsibleUser,
  // "/tasks/getAllTasksByDep": TasksControler.getAllTasksByDep,
  // "/tasks/getAllResponsibleTasksByDep": TasksControler.getAllResponsibleTasksByDep,
  // "/tasks/getAllAppointTasksFromDep": TasksControler.getAllAppointTasksFromDep,
  // "/tasks/getAllResponsibleTasksBySubDep": TasksControler.getAllResponsibleTasksBySubDep,
  // "/tasks/getAllResponsibleTasksByUserId": TasksControler.getAllResponsibleTasksByUserId,
  // "/tasks/updateTaskConfirmRequest": TasksControler.updateTaskConfirmRequest,
  // "/tasks/updateTaskCloseRequest": TasksControler.updateTaskCloseRequest,
  // "/tasks/getTaskFile": TasksControler.getTaskFile,
  // "/tasks/updateTask": TasksControler.updateTask,
  // "/tasks/getFullFileContent" : TasksControler.getFullFileContent,
  // "/tasks/getPreviewFileContent" : TasksControler.getPreviewFileContent,
  // "/tasks/updateTaskRejectRequest" : TasksControler.updateTaskRejectRequest,
};

const handleTaskRoutes = async (req, res) => {
  const { url, method } = req;
  
  try {
    if (url.startsWith("/tasks")) {
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
    res.end(JSON.stringify({ error: "handleTaskRoutes - ERROR" }));
  }
};

module.exports = {
  handleTaskRoutes
};