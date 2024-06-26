'use strict'

const {handleDefaultRoute} = require('./handleDefaultRoute')
const logger = require('../utils/logger/logger');
const AuthControler = require('../controllers/Auth/AuthControler');

const routeHandlers = {
  "/auth/registrationLocalUser": AuthControler.registrationLocalUser,
  "/auth/login": AuthControler.login,
  "/auth/changePassword": AuthControler.changePassword,
  "/auth/changePasswordByPincode": AuthControler.changePasswordByPincode,
  "/auth/resetPassword": AuthControler.resetPassword,
};

const handleAuthRoutes = async (req, res) => {
  req.on('error', (err) => {
    console.error('handleAuthRoutes! Ошибка в запросе:', err)
    logger.error('handleAuthRoutes! Ошибка в запросе:', err)
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Ошибка в запросе' }))
  });

  const { url, method } = req;
  
  try {
    if (url.startsWith("/auth")) {
      const routeHandler = routeHandlers[url]
      if (routeHandler) {
        if (method === "POST") {
          await routeHandler(req, res)
        } else {
          handleDefaultRoute(req, res)
        }
      } else {
        handleDefaultRoute(req, res)
      }
    } else {
      handleDefaultRoute(req, res)
    }
  } catch (error) {
    res.statusCode = 500
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ error: "handleAuthRoutes - ERROR" }))
  }
}

module.exports = { handleAuthRoutes };