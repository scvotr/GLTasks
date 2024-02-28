'use strict'

const logger = require('../../utils/logger/logger')

class AuthControler {
  async registrationLocalUser(req, res) {
    try {
      res.statusCode = 200
      res.setHeader("Content-Type", "application/json")
      const postPayload = await getPostDataset(req)
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