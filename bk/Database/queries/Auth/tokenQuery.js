'use strict'
const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const addTokenQ = async (userId, token) => {
  try {
    const command = `INSERT INTO tokens(user_id, token) VALUES (?, ?)`
    await executeDatabaseQueryAsync(command, [userId, token], `run`)
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const updateTokenQ = async (userId, token) => {
  try {
    const command = `UPDATE tokens SET token = ? WHERE user_id = ?`
    await executeDatabaseQueryAsync(command, [userId, token], `run`)
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const getTokenQ = async (userId) => {
  try {
    const command = `SELECT * FROM tokens WHERE user_id = ?`
    return await executeDatabaseQueryAsync(command, [userId])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const findTokenQ = async (token) => {
  try {
    const command = `SELECT * FROM tokens WHERE token = ?`
    return await executeDatabaseQueryAsync(command, [token])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const deleteTokenQ = async (userId) => {
  try {
    const command = `DELETE FROM tokens WHERE user_id = ?`
    await executeDatabaseQueryAsync(command, [userId], `run`)
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

module.exports = {
  addTokenQ,
  updateTokenQ,
  getTokenQ,
  findTokenQ,
  deleteTokenQ,
}
// ! РАБОЧИЙ ВАРИАНТ нужно попробывать
// class TokenRepository {
//   async addToken(userId, token) {
//     try {
//       const command = `INSERT INTO tokens(user_id, token) VALUES (?, ?)`;
//       await executeDatabaseQueryAsync(command, [userId, token], "run");
//     } catch (error) {
//       throw new Error("Ошибка запроса к базе данных");
//     }
//   }

//   async updateToken(userId, token) {
//     try {
//       const command = `UPDATE tokens SET token = ? WHERE user_id = ?`;
//       await executeDatabaseQueryAsync(command, [token, userId], "run");
//     } catch (error) {
//       throw new Error("Ошибка запроса к базе данных");
//     }
//   }

//   async getToken(userId) {
//     try {
//       const command = `SELECT * FROM tokens WHERE user_id = ?`;
//       const result = await executeDatabaseQueryAsync(command, [userId], "run");
//       return result;
//     } catch (error) {
//       throw new Error("Ошибка запроса к базе данных");
//     }
//   }

//   async deleteToken(userId) {
//     try {
//       const command = `DELETE FROM tokens WHERE user_id = ?`;
//       await executeDatabaseQueryAsync(command, [userId], "run");
//     } catch (error) {
//       throw new Error("Ошибка запроса к базе данных");
//     }
//   }
// }

// const TokenRepository = require("./TokenRepository");

// const tokenRepo = new TokenRepository();

// // Пример использования операций CRUD

// await tokenRepo.addToken(userId, token); // Создание новой записи
// await tokenRepo.updateToken(userId, newToken); // Обновление записи
// const token = await tokenRepo.getToken(userId); // Получение записи
// await tokenRepo.deleteToken(userId); // Удаление записи