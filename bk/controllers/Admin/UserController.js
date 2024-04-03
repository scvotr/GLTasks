'use strict'

const jwt = require("jsonwebtoken")
const {
  getAllUsersQ,
  updateUserDataQ,
  findUserByIdQ
} = require("../../Database/queries/User/adminQuery")
const {
  updateTokenQ
} = require("../../Database/queries/Auth/tokenQuery")
const {
  socketManager
} = require("../../utils/socket/socketManager")
require("dotenv").config()
const SECRET_KEY = process.env.KEY_TOKEN

class UserController {
  async getAllUsers(req, res) {
    try {
      const authDecodeUserData = req.user
      if (authDecodeUserData.role !== "admin") {
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
  async updateUserData(req, res) {
    const io = socketManager.getIO()

    const authDecodeUserData = req.user
    const userData = JSON.parse(authDecodeUserData.payLoad)
    if (authDecodeUserData.role !== "admin") {
      return res.end(
        JSON.stringify({
          updateUserData: "Нет прав на доступ",
        })
      );
    }

    const updateUserAndSendNotification = async () => {
      try {
        await updateUserDataQ(userData);
        const updatedUser = await findUserByIdQ(userData.id);
        const token = jwt.sign(...updatedUser, SECRET_KEY);
        await updateTokenQ(updatedUser[0].id, token);
  
        res.setHeader("Access-Control-Expose-Headers", "Authorization");
        res.setHeader("Authorization", `Bearer ${token}`);
        res.statusCode = 201;
        res.end(JSON.stringify({
          Registration: "Пользователь обновлен",
        }));
      } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          error: "updateUserData - ERROR",
        }));
      }
    };

    const checkAndSetUser = () => {
      io.in('user_' + userData.id).allSockets()
        .then(client => {
          if (client.size === 0) {
            console.log('offline', client, userData.id)
            updateUserAndSendNotification()
          } else {
            io.to('user_' + userData.id)
              .emit('taskApproved', {
                message: 'Сообщение от администратора: Пожалуйста, выйдите из системы! Вам будет назначен отдел и должность.',
                taskData: userData.loginName
              })
            console.log('online', client, userData.id);
          }
        })
        .catch(error => {
          console.error(error); // Обработка ошибки
        });
    };
    try {
      checkAndSetUser()
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify({
        error: "updateUserData - ERROR"
      }))
    }
  }
}

module.exports = new UserController()