'use strict'

const jwt = require("jsonwebtoken")
const { getAllUsersQ, updateUserDataQ, findUserByIdQ } = require("../../Database/queries/User/adminQuery")
const { updateTokenQ } = require("../../Database/queries/Auth/tokenQuery")
require("dotenv").config()
const SECRET_KEY = process.env.KEY_TOKEN

class UserControler {
  async getAllUsers(req, res) {
    try {
      const authDecodeUserData = req.user
      if(authDecodeUserData.role !== "admin") {
        return res.end(
          JSON.stringify({
            getAllUsers: "Нет прав на доступ",
          })
        )  
      }
      const data = await getAllUsersQ()
      data.length === 0 ? res.statusCode = 204 :
      res.statusCode = 200
      res.setHeader("Content-Type", "application/json")
      res.write(JSON.stringify(data))
      res.end()
    } catch (error) {
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: "getAllUsers",
        })
      );
    }
  }
  async updateUserData(req,res) {
    const authDecodeUserData = req.user
    const userData = JSON.parse(authDecodeUserData.payLoad)
    if (authDecodeUserData.role !== "admin") {
      return res.end(
        JSON.stringify({
          updateUserData: "Нет прав на доступ",
        })
      );
    }
    try {
      await updateUserDataQ(userData)
      const udapdedUser = await findUserByIdQ(userData.id)
      const token = jwt.sign(...udapdedUser, SECRET_KEY)
      await updateTokenQ(udapdedUser[0].id, token)

      res.setHeader("Access-Control-Expose-Headers", "Authorization");
      res.setHeader("Authorization", `Bearer ${token}`);
      res.statusCode = 201
      res.end(JSON.stringify({ Registration: "Пользователь обновлен" }))

    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json")
      res.end( JSON.stringify({error: "updateUserData - ERROR" })
      )
    }
  }
}

module.exports = new UserControler()