'use strict'
const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const getSubDepartmentsByIDQ = async (dep_id) => {
  try {
    const command = `SELECT * FROM subdepartments WHERE department_id = ?`
    return await executeDatabaseQueryAsync(command, [dep_id])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

module.exports = {
  getSubDepartmentsByIDQ,
}