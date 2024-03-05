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
    console.log('userData', userData)
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
      console.log(token)
      await updateTokenQ(userData.id, token)
    } catch (error) {
      
    }
  }
}

module.exports = new UserControler()