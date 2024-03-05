'use strict'
const {
  executeDatabaseQueryAsync
} = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const getPositionsByIDQ = async (subDep_id) => {
  try {
    const command = `SELECT * FROM positions WHERE subdepartment_id = ?`
    return await executeDatabaseQueryAsync(command, [subDep_id])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const getPositionsQ = async (subDep_id) => {
  try {
    const command = `
    SELECT p.id, p.name AS position_name, d.name AS department_name, sd.name AS subdepartment_name
    FROM positions p
    LEFT JOIN departments d ON p.department_id = d.id
    LEFT JOIN subdepartments sd ON p.subdepartment_id = sd.id;
    `
    return await executeDatabaseQueryAsync(command, [])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const getPositionsBySubDepIdQ = async (subDep_id) => {
  try {
    const command = `
    SELECT p.id, p.name AS position_name, d.name AS department_name, sd.name AS subdepartment_name
    FROM positions p
    LEFT JOIN departments d ON p.department_id = d.id
    LEFT JOIN subdepartments sd ON p.subdepartment_id = sd.id
    WHERE p.subdepartment_id = ?;
    `
    return await executeDatabaseQueryAsync(command, [subDep_id])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

module.exports = {
  getPositionsByIDQ,
  getPositionsQ,
  getPositionsBySubDepIdQ,
}