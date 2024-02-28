'use strict'

const { getPostDataset } = require('../../utils/getPostDataset')
const { logger } = require('../../utils/logger/logger')

class AuthControler {
  async registrationLocalUser(req, res) {
    try {
      res.statusCode = 200
      res.setHeader("Content-Type", "application/json")
      const postPayload = await getPostDataset(req)
      let postData = JSON.parse(postPayload)

      console.log('registrationLocalUser', postData)

      const { name, email=`${name}@mail.local`, password, pincode } = postData
      console.log(name, email, password, pincode)
      const isEmpty = name && password && pincode
      if(!isEmpty) return res.end(JSON.stringify({ Registrtaion: "Пустые поля" })) 

    } catch (error) {
      console.error('Ошибка при регистрации локального пользователя', error)
      logger.error('Ошибка при регистрации локального пользователя', error)
      res.statusCode = 500
      res.end(
        JSON.stringify({ error: "Ошибка при регистрации локального пользователя." })
      );
    }
  }
}

module.exports = new AuthControler();