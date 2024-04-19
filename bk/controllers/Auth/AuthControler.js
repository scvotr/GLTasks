'use strict'

const { checkEqualNameQ, createNewUserQ, getNewUserQ, changeUserPasswordQ } = require('../../Database/queries/Auth/authQuery')
const { addTokenQ, getTokenQ, updateTokenQ } = require('../../Database/queries/Auth/tokenQuery')
const { getPostDataset } = require('../../utils/getPostDataset')

require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const logger = require('../../utils/logger/logger')
const { emptyProfileU, notDistributedU } = require('../../utils/fieldsCheck/fieldsCheck')

const HASH_SALT = parseInt(process.env.KEY_SALT)
const SECRET_KEY = process.env.KEY_TOKEN

class AuthControler {
  async registrationLocalUser(req, res) {
    try {
      res.statusCode = 200
      res.setHeader("Content-Type", "application/json")
      const postPayload = await getPostDataset(req)
      let postData = JSON.parse(postPayload)
      const { login, password, pincode } = postData
      const isEmpty = login && password && pincode
      if(!isEmpty) return res.end(JSON.stringify({ Registration: "Пустые поля" })) 
      const checkEqualName = await checkEqualNameQ(login)
      if(checkEqualName.length) {
        logger.infoAuth(`Пользовтель уже есть ${login}`)
        res.statusCode = 409
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({Registration: "Такой пользователь уже зарегистрирован"}))
        return
      }
      const hashedPassword = await bcrypt.hash(password, HASH_SALT)
      const hashedPincode = await bcrypt.hash(pincode, HASH_SALT)
      const newUserData = { ...postData, email:`${login}@mail.local`, password:hashedPassword, pincode:hashedPincode }
      try {
        await createNewUserQ(newUserData)
        const getNewUser = await getNewUserQ(postData.login, hashedPassword)
        const token = jwt.sign(...getNewUser, SECRET_KEY)
        await addTokenQ(getNewUser[0].id, token) //! rf
        logger.infoAuth(`Пользовтель зарегистрирован ${postData.login}`)
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
      const {login, password} = postData
      const isEmpty = login && password
      if(!isEmpty) return res.end(JSON.stringify({Authtorisation: "Пустые поля"}))
      const nameIsEqual = await checkEqualNameQ(login)
      if(!nameIsEqual.length) return res.end(JSON.stringify({Authtorisation: "Пользователь не найден"}))
      const userData = {...nameIsEqual[0]}
      const checkPassword = await bcrypt.compare(password, userData.password)
      if(!checkPassword) return res.end(JSON.stringify({Authtorisation: "Не верный пароль"}))
      const token = await getTokenQ(userData.id)
      const authData = JSON.stringify({
        Authorization: "Авторизация прошла успешно.",
        id: userData.id,
        loginName: userData.login,
        name: userData.login,
        role: userData.role,
        role_ref: userData.role_ref,
        dep: userData.department_id,
        subDep: userData.subdepartment_id,
        position: userData.position_id,
        notDistributed : notDistributedU(userData),
        emptyProfile: emptyProfileU(userData),
        // last_name: userData.last_name,
        // first_name: userData.first_name,
        // middle_name: userData.middle_name,
        // internal_phone: userData.internal_phone,
        // external_phone: userData.external_phone,
        // office_number: userData.office_number,
      })
      res.setHeader("Access-Control-Expose-Headers", "Authorization");
      res.setHeader("Authorization", `Bearer ${token[0].token}`);
      res.end(authData)
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Ошибка при аутентификации пользователя." }));
    }
  }
  async changePassword(req, res) {
    try {
      const postPayload = await getPostDataset(req);
      const postData = JSON.parse(postPayload);
      const { name, oldPassword,  newPassword} = postData;
      const isEmpty = !name || !oldPassword || !newPassword;
      if(isEmpty) {
        return res.end(JSON.stringify({ changePassword: "Пустые поля. Empty fields" }));
      } 
      const userName = await checkEqualNameQ(name);
      if (!userName.length)
      return res.end(
        JSON.stringify({ changePassword: "Пользователь не найден. User not found" })
      );
      const objDataUser = userName.find((item) => item);
      const isPasswordMatched = await bcrypt.compare(
        oldPassword,
        objDataUser.password
      );
      if (!isPasswordMatched)
        return res.end(JSON.stringify({ changePassword: "Пароль не верный. Wrong Pass" }));
      const hashedNewPassword = await bcrypt.hash(newPassword, HASH_SALT);
      const userData = {
        id: objDataUser.id, 
        password: hashedNewPassword, 
      };
      await changeUserPasswordQ(userData)
      const arrDataUser = await getNewUserQ(postData.name, hashedNewPassword); //шаг выглядит избыточным
      const objDataToken = arrDataUser.find((item) => item);
      const token = jwt.sign(objDataToken, SECRET_KEY)
      await updateTokenQ(objDataToken.id, token);
      res.setHeader("Access-Control-Expose-Headers", "Authorization");
      res.setHeader("Authorization", `Bearer ${token}`);
      res.statusCode = 201;
      res.end(JSON.stringify({ changePassword: "Пароль успешно изменен/ Succes" }));
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(
        JSON.stringify({ error: "Ошибка при смене пароля. Change pass error" })
      );
    }
  }  
  async changePasswordByPincode(req, res) {
    try {
      const postPayload = await getPostDataset(req);
      const postData = JSON.parse(postPayload);
      const { name, newPassword,  psPincode} = postData;
      const isEmpty = !name || !newPassword || !psPincode;
      if(isEmpty) {
        return res.end(JSON.stringify({ dropPasswordByPincode: "Пустые поля" }));
      } 
      const userName = await chekUserLoginName(name);
      if (!userName.length)
      return res.end(
        JSON.stringify({ dropPasswordByPincode: "Пользователь не найден" })
      );
      const objDataUser = userName.find((item) => item);
      const isPincodeMatched = await bcrypt.compare(
        psPincode,
        objDataUser.psPincode
      );
      if (!isPincodeMatched)
        return res.end(JSON.stringify({ dropPasswordByPincode: "Пинкод не верный" }));
      const hashedNewPassword = await bcrypt.hash(newPassword, HASH_SALT);
      const userData = {
        id: objDataUser.id, 
        password: hashedNewPassword, 
      };
      await changeUserPassword(userData)
      const arrDataUser = await getUserByLgPs(postData.name, hashedNewPassword); //шаг выглядит избыточным
      const objDataToken = arrDataUser.find((item) => item);
      const token = jwt.sign(objDataToken, SECRET_KEY)
      await createTokenParams(objDataToken.id, token);
      res.setHeader("Access-Control-Expose-Headers", "Authorization");
      res.setHeader("Authorization", `Bearer ${token}`);
      res.statusCode = 201;
      res.end(JSON.stringify({ changePassword: "Пароль успешно изменен" }));
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(
        JSON.stringify({ error: "Ошибка при смене пароля." })
      );
    }
  }
  async resetPassword(req, res) {
    try {
      const postPayload = await getPostDataset(req)
      const postData = JSON.parse(postPayload)
      const { loginName } = postData
      const isEmpty = !loginName
      if(isEmpty) {
        return res.end(JSON.stringify({ resetPassword: "Пустые поля. Empty fields" }));
      } 
      const userName = await checkEqualNameQ(loginName);
      if (!userName.length)
      return res.end(
        JSON.stringify({ resetPassword: "Пользователь не найден. User not found" })
      );
      const objDataUser = userName.find((item) => item);

      const hashedNewPassword = await bcrypt.hash('1111', HASH_SALT);
      const userData = {
        id: objDataUser.id, 
        password: hashedNewPassword, 
      };
      await changeUserPasswordQ(userData)
      const arrDataUser = await getNewUserQ(postData.loginName, hashedNewPassword); //шаг выглядит избыточным
      const objDataToken = arrDataUser.find((item) => item);
      const token = jwt.sign(objDataToken, SECRET_KEY)
      await updateTokenQ(objDataToken.id, token);
      res.setHeader("Access-Control-Expose-Headers", "Authorization");
      res.setHeader("Authorization", `Bearer ${token}`);
      res.statusCode = 201;
      res.end(JSON.stringify({ resetPassword: "Пароль успешно сброшен/ Succes" }));
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(
        JSON.stringify({ error: "Ошибка при сбросе пароля. Reset pass error" })
      );
    }
  } 
}

module.exports = new AuthControler();