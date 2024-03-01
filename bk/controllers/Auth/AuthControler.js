'use strict'

const { checkEqualNameQ, createNewUserQ, getNewUserQ } = require('../../Database/queries/Auth/authQuery')
const { addTokenQ } = require('../../Database/queries/Auth/tokenQuery')
const { getPostDataset } = require('../../utils/getPostDataset')
const { logger } = require('../../utils/logger/logger')

require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const HASH_SALT = parseInt(process.env.KEY_SALT)
const SECRET_KEY = process.env.KEY_TOKEN

class AuthControler {
  async registrationLocalUser(req, res) {
    try {
      res.statusCode = 200
      res.setHeader("Content-Type", "application/json")
      const postPayload = await getPostDataset(req)
      let postData = JSON.parse(postPayload)
      const { name, password, pincode } = postData
      const isEmpty = name && password && pincode
      if(!isEmpty) return res.end(JSON.stringify({ Registrtaion: "Пустые поля" })) 
      const checkEqualName = await checkEqualNameQ(name)
      if(checkEqualName.length) {
        const message = {
          Registrtaion: "Такой пользователь уже зарегистрирован"
        }
        res.statusCode = 409
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(message))
        return
      }
      const hashedPassword = await bcrypt.hash(password, HASH_SALT)
      const hashedPincode = await bcrypt.hash(pincode, HASH_SALT)
      const newUserData = { ...postData, email:`${name}@mail.local`, password:hashedPassword, pincode:hashedPincode }
      await createNewUserQ(newUserData)
      const getNewUser = await getNewUserQ(postData.name, hashedPassword)
      const token = jwt.sign(...getNewUser, SECRET_KEY)
      await addTokenQ(getNewUser[0].id, token) //! rf
      res.setHeader("Access-Control-Expose-Headers", "Authorization");
      res.setHeader("Authorization", `Bearer ${token}`);
      res.statusCode = 201
      res.end(JSON.stringify({ Registration: "Пользователь зарегистрирован" }))
    } catch (error) {
      console.error('Ошибка при регистрации локального пользователя', error)
      logger.error('Ошибка при регистрации локального пользователя', error)
      res.statusCode = 500
      res.end(
        JSON.stringify({ error: "Ошибка при регистрации локального пользователя." })
      );
    }
  }
  async login(req, res) {
    try {
      res.statusCode = 200
      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify('sss'))
    } catch (error) {
      
    }
  }
}

module.exports = new AuthControler();