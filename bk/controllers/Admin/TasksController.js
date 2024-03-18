const { getAllTasksQ } = require("../../Database/queries/Task/adminTaskQueries");

class TasksController {
  async getAllTasks(req, res) {
    try {
      const authDecodeUserData = req.user
      if (authDecodeUserData.role !== "admin") {
        return res.end(
          JSON.stringify({
            getAllTasks: "Нет прав доступа",
          })
        )
      }
      const data = await getAllTasksQ()
      if (data.length === 0) {
        res.statusCode = 204
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(data));
      }
      res.end()
    } catch (error) {
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: "getAllTasks",
        })
      );
    }
  }
}

module.exports = new TasksController()