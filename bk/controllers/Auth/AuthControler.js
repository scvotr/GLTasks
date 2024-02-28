'use strict'

const logger = require('../../utils/logger/logger')

class AuthControler {
  async registrationLocalUser(req, res) {
    try {
      
    } catch (error) {
      console.error('Ошибка при регистрации локального пользователя', error)
      logger.error('Ошибка при регистрации локального пользователя', error)
      res.statusCode = 500;
      res.end(
        JSON.stringify({ error: "Ошибка при регистрации локального пользователя." })
      );
    }
  }
}

module.exports = new AuthControler();