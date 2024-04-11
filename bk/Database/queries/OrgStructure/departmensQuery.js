'use strict'
const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const getAllDepartmentsQ = async (userId) => {
  try {
    const command = `SELECT * FROM departments  WHERE id <> 1`
    return await executeDatabaseQueryAsync(command, [])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

module.exports = {
  getAllDepartmentsQ,
}