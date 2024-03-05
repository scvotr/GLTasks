'use strict'
const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const getAllUsers = async () => {
  try {
    const command = `
    SELECT 
    users.id, 
      users.name, 
      users.email, 
      users.role,
      users.pin_code,
      users.last_name,
      users.first_name,
      users.middle_name,
      users.internal_phone,
      users.external_phone,
      users.office_number, 
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

module.exports = {getAllUsers}