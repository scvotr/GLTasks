'use strict'
const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const getPositionsByIDQ = async (subDep_id) => {
  try {
    const command = `SELECT * FROM positions WHERE subdepartment_id = ?`
    return await executeDatabaseQueryAsync(command, [subDep_id])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

module.exports = {
  getPositionsByIDQ,
}