'use strict'

const jwt = require("jsonwebtoken")
const { getAllUsersQ } = require("../../Database/queries/User/adminQuery")
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
    const authDecodeUserData = req.user;
    // const userData = JSON.parse(authDecodeUserData.payLoad);
    console.log('userData', authDecodeUserData)
  }
}

module.exports = new UserControler()