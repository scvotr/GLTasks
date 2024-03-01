'use strict'

const { checkEqualNameQ, createNewUserQ, getNewUserQ } = require('../../Database/queries/Auth/authQuery')
const { addTokenQ, getTokenQ } = require('../../Database/queries/Auth/tokenQuery')
const { getPostDataset } = require('../../utils/getPostDataset')

require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const logger = require('../../utils/logger/logger')

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
      if(!isEmpty) return res.end(JSON.stringify({ Registration: "Пустые поля" })) 
      const checkEqualName = await checkEqualNameQ(name)
      if(checkEqualName.length) {
        logger.infoAuth(`Пользовтель уже есть ${name}`)
        res.statusCode = 409
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({Registration: "Такой пользователь уже зарегистрирован"}))
        return
      }
      const hashedPassword = await bcrypt.hash(password, HASH_SALT)
      const hashedPincode = await bcrypt.hash(pincode, HASH_SALT)
      const newUserData = { ...postData, email:`${name}@mail.local`, password:hashedPassword, pincode:hashedPincode }
      try {
        await createNewUserQ(newUserData)
        const getNewUser = await getNewUserQ(postData.name, hashedPassword)
        const token = jwt.sign(...getNewUser, SECRET_KEY)
        await addTokenQ(getNewUser[0].id, token) //! rf
        logger.infoAuth(`Пользовтель зарегистрирован ${postData.name}`)
        res.setHeader("Access-Control-Expose-Headers", "Authorization");
        res.setHeader("Authorization", `Bearer ${token}`);
        res.statusCode = 201
        res.end(JSON.stringify({ Registration: "Пользователь зарегистрирован" }))
      } catch (error) {
        res.statusCode = 500
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify('Ошибка при ригистрации'))
      }
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
      const postPayload = await getPostDataset(req)
      const postData = JSON.parse(postPayload)
      const {name, password} = postData
      const isEmpty = name && password
      if(!isEmpty) return res.end(JSON.stringify({Authtorisation: "Пустые поля"}))
      const nameIsEqual = await checkEqualNameQ(name)
      if(!nameIsEqual.length) return res.end(JSON.stringify({Authtorisation: "Пользователь не найден"}))
      const userData = {...nameIsEqual[0]}
      const checkPassword = await bcrypt.compare(password, userData.password)
      if(!checkPassword) return res.end(JSON.stringify({Authtorisation: "Не верный пароль"}))
      const token = await getTokenQ(userData.id)
      const authData = JSON.stringify({
        Authorization: "Авторизация прошла успешно.",
        id: userData.id,
        name: userData.name,
        role: userData.role,
        role_ref: userData.role_ref,
        dep: userData.department_id,
        subDep: userData.subdepartment_id,
        position: userData.position_id,
      })
      console.log(authData)
      res.setHeader("Access-Control-Expose-Headers", "Authorization");
      res.setHeader("Authorization", `Bearer ${token[0].token}`);
      res.end(authData)
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Ошибка при аутентификации пользователя." }));
    }
  }
}

module.exports = new AuthControler();