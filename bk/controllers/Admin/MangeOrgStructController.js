const { createNewDep, createNewSubDep, createNewPosition, deleteDep, deleteSubDep } = require("../../Database/queries/OrgStructure/adminQuery");

class MangeOrgStructController {
  async createNewDep(req, res) {
    try {
      const authDecodeUserData = req.user;
      const data = JSON.parse(authDecodeUserData.payLoad);
      if (authDecodeUserData.role !== "admin") {
        return res.end(
          JSON.stringify({
            createNewDep: "Нет прав на доступ",
          })
        );
      }
      await createNewDep(data)
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: "createNewDep - ERROR",
        })
      );
    }
  }
  async deleteDep(req, res) {
    try {
      const authDecodeUserData = req.user;
      const data = JSON.parse(authDecodeUserData.payLoad);
      if (authDecodeUserData.role !== "admin") {
        return res.end(
          JSON.stringify({
            createNewDep: "Нет прав на доступ",
          })
        );
      }
      await deleteDep(data)
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: "createNewDep - ERROR",
        })
      );
    }
  }
  async createNewSubDep(req, res) {
    console.log('sdsd')
    try {
      const authDecodeUserData = req.user;
      const data = JSON.parse(authDecodeUserData.payLoad);
      if (authDecodeUserData.role !== "admin") {
        return res.end(
          JSON.stringify({
            createNewSubDep: "Нет прав на доступ",
          })
        );
      }
      await createNewSubDep(data)
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: "createNewSubDep - ERROR",
        })
      );
    }
  }
  async deleteSubDep(req, res) {
    try {
      const authDecodeUserData = req.user;
      const data = JSON.parse(authDecodeUserData.payLoad);
      if (authDecodeUserData.role !== "admin") {
        return res.end(
          JSON.stringify({
            createNewDep: "Нет прав на доступ",
          })
        );
      }
      await deleteSubDep(data)
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: "deleteSubDep - ERROR",
        })
      );
    }
  }
  async createNewPosition(req, res) {
    try {
      const authDecodeUserData = req.user;
      const data = JSON.parse(authDecodeUserData.payLoad);
      if (authDecodeUserData.role !== "admin") {
        return res.end(
          JSON.stringify({
            updateUserData: "Нет прав на доступ",
          })
        );
      }
      await createNewPosition(data)
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: "createNewPosition - ERROR",
        })
      );
    }
  }
}

module.exports = new MangeOrgStructController()