'use strict'

const jwt = require("jsonwebtoken")
const { getAllUsers } = require("../../Database/queries/User/adminQuery")
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
      const data = await getAllUsers()
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
}

module.exports = new UserControler()