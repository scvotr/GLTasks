const { getPostDataset} = require('./getPostDataset')
const jwt = require('jsonwebtoken');
const { getTokenQ } = require('../Database/queries/Auth/tokenQuery');
require('dotenv').config();

function protectRouteTkPl(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return res.end(JSON.stringify({ error: 'Ошибка аутентификации токена нет' }));
      }

      // Verify the token using your server's secret key
      const decodedToken = jwt.verify(token, process.env.KEY_TOKEN); //console.log("decodedToken: ", decodedToken)
      // console.log('decodedToken', decodedToken)
      // Check if the user exists and has a valid token in the database
      const user = await getTokenQ(token);
      // console.log('sss',user[0].token)
      if (!user || user[0].token !== token) {
        return res.end(JSON.stringify({ error: 'Ошибка аутентификации  if (!user || user[0].token !== token)' }));
      }
      
      const payLoad = await getPostDataset(req)
      // console.log('payLoad', payLoad)
      const data = {... decodedToken, payLoad}
      // console.log('protectRouteTkPl data: ', data)
      // Прикрепляем к ответу даныен из токена или свои данные
      // req.user = decodedToken;
      req.user = data;

      // Call the original route handler with the modified request object
      // Вызываем хендлер и передаем уже измененый запрос и ответ
      return handler(req, res);
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Внутренняя ошибка сервера' }));
    }
  };
}

module.exports = {
  protectRouteTkPl,
}