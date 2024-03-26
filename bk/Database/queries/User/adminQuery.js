'use strict'
const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const getAllUsersQ = async () => {
  try {
    const command = `
    SELECT 
    users.id, 
      users.login, 
      users.email, 
      users.role,
      users.pin_code,
      users.last_name,
      users.first_name,
      users.middle_name,
      users.internal_phone,
      users.external_phone,
      users.office_number, 
      users.created_on,
      departments.id AS department_id,
      departments.name AS department, 
      subdepartments.id AS subdepartment_id,
      subdepartments.name AS subdepartment,
      positions.id AS position_id,
      positions.name AS position
    FROM 
      users 
      LEFT JOIN departments ON users.department_id = departments.id
      LEFT JOIN subdepartments ON users.subdepartment_id = subdepartments.id
      LEFT JOIN positions ON users.position_id = positions.id;
  `;
    return await executeDatabaseQueryAsync(command, [], 'all')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const updateUserDataQ = async(data) => {
  console.log(data)
  try {
    const {id, loginName, role, department_id, subdepartment_id, position_id} = data
    const command = `UPDATE users SET login = ?, role = ?, department_id = ?, subdepartment_id = ?, position_id = ? WHERE id = ?`;
    await executeDatabaseQueryAsync(command, [loginName, role, department_id, subdepartment_id, position_id, id], 'run')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const findUserByIdQ = async(user_id) => {
  try {
    const command = `SELECT * FROM users WHERE id = ?`
    return await executeDatabaseQueryAsync(command,[user_id], 'all')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

module.exports = {
  getAllUsersQ,
  updateUserDataQ,
  findUserByIdQ,
}